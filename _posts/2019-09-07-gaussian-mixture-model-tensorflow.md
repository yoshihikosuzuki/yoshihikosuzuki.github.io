---
layout: post
title: Tensorflow (Probability) で混合ガウスモデル
plotly: true
---

TensorFlow (version 1.4), TensorFlow Probability, Edwards2 の勉強のために、最尤推定とベイズ推定の各種解法で、潜在変数ありの場合に代表的な混合ガウスモデルを解く。潜在変数なしの[線形回帰はこちら]({% post_url 2019-09-06-linear-regression-tensorflow %})。

[Jupyter Notebook はここ](https://nbviewer.jupyter.org/gist/yoshihikosuzuki/9d06ebb320789dd1a0c2389964a2d33e)。Plotly まわりのために [BITS](https://github.com/yoshihikosuzuki/BITS) という自作パッケージを使っているので、コードを動かす場合はインストールする。

Tensorflow 関連のインポートは以下の通り。今回は Eager Execution を使用する。また、`ed.RandomVariable`ではなく`tfd.*`をいじる必要が出てくるのでそれもインポートとしている。

```python
import tensorflow as tf
import tensorflow_probability as tfp
tfd = tfp.distributions
from tensorflow_probability import edward2 as ed
tf.enable_eager_execution()
```

## モデル

$\mathbb{R}^2$ 上のガウス分布 $K$ 個の混合分布から $N$ 個のデータ $x_1,\cdots,x_N$ を観測したとする。データ $x_i$ が属する分布を $z_i\in[1..K]$ で表すと、混合ガウス分布は

$$
x_i\sim{\rm Normal}_2(\mu_{z_i},\sigma^2_{z_i}I)
$$

と書ける。ただし、$\mu_\cdot\in\mathbb{R}^2,\sigma^2_\cdot\in\mathbb{R}$ で $I$ は2次元単位行列。

## データ生成

定数は以下の通り。

```python
D = 2   # number of dimensions of data
K = 3   # number of mixture components
N = 1000   # number of data (= observations)
```

各パラメタは適当な一様分布から決めた。`pi_true`は真の混合比率。

```python
dtype = np.float32
mu_true = np.random.uniform(-1, 1, [D, 2]).astype(dtype)
sigma_true = np.random.uniform(0.05, 0.1, [D, 1]).astype(dtype)
z_true = np.random.choice(2, N)
pi_true = np.expand_dims(np.unique(z_true, return_counts=True)[1] / N, axis=1).astype(dtype)
x = np.array([np.random.multivariate_normal(mu_true[z_true[i]], sigma_true[z_true[i]] * np.identity(D)) for i in range(N)]).astype(dtype)
```

生成したデータを2次元平面にプロットすると以下の通り。分布が気に入らなければ再度上のコードを実行して生成し直す。

{% include plotly/gaussian_mixture_data.html %}

## 最尤推定

共分散行列がすべて $I$ の混合ガウス分布の対数尤度最大化

$$
\underset{z,\mu}{\arg\max}\log\prod_{i=1}^{N}{\rm Normal}_2(x_i\vert\mu_{z_i},I)
$$

は、k-means クラスタリングの目的関数最小化

$$
\underset{z,\mu}{\arg\min}\sum_{i=1}^{N}\sum_{k=1}^{K}\delta(z_i=k)\|x_i-\mu_k\|^2
$$

と同じ。

### EM アルゴリズム (k-means クラスタリング)

`sklearn`があるのにフルスクラッチで実装するのはさすがに面倒だったので手抜き。一応 Tensorflow にも `tf.contrib.factorization.KMeans` というものはあるらしい。バージョン2で残るかは分からない。

```python
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=K, random_state=0).fit(x)
```

結果は以下の通り。k-means は等分散を仮定しているため、分布ごとに分散が大きく異なる場合はうまくいかない。

{% include plotly/gaussian_mixture_kmeans_result.html %}

### EM アルゴリズム (分散も推定)

TODO

## ベイズ推定

生成モデルは以下のようにする。

$$
\pi\sim{\rm Dir}(\alpha) \\
z_i\sim{\rm Cat}(\pi) \\
\mu_k\sim{\rm Normal}_2(\mu_0,\Sigma_0) \\
\sigma^2\sim{\rm InvGamma}(a_0,b_0) \\
x_i\sim{\rm Normal}_2(\mu_{z_i},\sigma^2_{z_i}I)
$$

ただし、$\pi=(\pi_1,\cdots,\pi_K),\sum_{k}\pi_k=1$ は分布の混合比率で、$\alpha=(\alpha_1,\cdots,\alpha_K),\mu_0,\Sigma_0,a_0,b_0$ はハイパーパラメタ。事後分布の形は以下の通り。

$$
p(\pi,z,\mu,\sigma^2\vert x)=\frac{p(x\vert z,\mu,\sigma^2)p(z\vert\pi)p(\pi)p(\mu)p(\sigma^2)}{p(x)}
$$

### ギブスサンプリング

TODO

### ハミルトニアンモンテカルロ法

ハイパーパラメタは以下のようにした。

```python
alpha0 = np.ones(K, dtype=dtype) / K
mu0 = np.zeros([K, D], dtype=dtype)
s0 = np.ones([K, D], dtype=dtype)
a0 = np.full(K, 10, dtype=dtype)
b0 = 0.5
```

同時分布を計算する関数`log_joint`およびそれを使って非正規化事後確率を計算する関数`unnormalized_posterior`を定義する。$z$ を消去するために`tfd.MixtureSameFamily`を使う。$K$ 個のガウス分布はまとめて`tfd.Independent`で扱う。このとき、`tfd.Independent(tfd.Normal(loc, scale))`の`loc`と`scale`の`shape`はともに`(K, D)`である必要がある。今回は1つのガウス分布の各次元の分散は同じとしているので少しややこしい。

```python
rv_pi = tfd.Dirichlet(alpha0, name="pi")
rv_mu = tfd.Independent(tfd.Normal(mu0, s0), reinterpreted_batch_ndims=1, name="mu")
rv_var = tfd.InverseGamma(a0, b0, name="var")

def tf_repeat(a, multiples, axis):
    """np.repeat() in tf."""
    return tf.concat([a for i in range(multiples)], axis=axis)

def log_joint(pi, mu, var, x):
    rv_x = tfd.MixtureSameFamily(tfd.Categorical(probs=pi),
                                 tfd.Independent(tfd.Normal(mu, tf_repeat(tf.sqrt(var)[:, tf.newaxis], D, axis=1))))
    sum_log_prob = tf.reduce_sum(tf.concat([rv_x.log_prob(x),
                                            rv_pi.log_prob(pi)[..., tf.newaxis],
                                            rv_mu.log_prob(mu),
                                            rv_var.log_prob(var)], axis=-1))
    assert not np.isnan(sum_log_prob), f"Nan, pi={pi}, mu={mu}"
    return sum_log_prob
    
def unnormalized_posterior(pi, mu, var):
    return log_joint(pi=pi, mu=mu, var=var, x=x_observed)
```

あとは推移核を作る。`step_size`と`n_leapfrog_steps`の値は何度か手で調整した後のもの。

```python
step_size = 0.003
n_leapfrog_steps = 1
hmc_kernel = tfp.mcmc.HamiltonianMonteCarlo(unnormalized_posterior, step_size, n_leapfrog_steps)
```

そして、パラメタの初期値を決めて MCMC を回す。。。のだが、各ガウス分布の平均 $\mu$ の初期値をすべて0で与えるとかなりの確率で`log_joint`の`sum_log_prob`が途中で NaN になってしまうため、真の $\mu$ を与えることにした。そうするとちゃんと動く。ちなみに[公式サンプル](https://github.com/tensorflow/probability/blob/master/tensorflow_probability/examples/jupyter_notebooks/Bayesian_Gaussian_Mixture_Model.ipynb)でも真の平均を初期値にしている (いいのか？)。

```python
n_burnin = 1000
n_iters = 3000
pi_init = np.ones(K, dtype=dtype) / K
mu_init = mu_true#np.zeros([K, D], dtype=dtype)
var_init = np.full(K, 0.05, dtype=dtype)

(pi_samples, mu_samples, var_samples), kernel_results = tfp.mcmc.sample_chain(n_iters,
                                                                              [pi_init, mu_init, var_init],
                                                                              num_burnin_steps=n_burnin,
                                                                              kernel=hmc_kernel)
```

ちなみにこのときの状態遷移の受容率 (=`np.mean(kernel_results.is_accepted)`) は約75%だった。

非正規化事後分布とパラメタの遷移をプロットしてみると、$\mu,\sigma^2$ は良さそうなのだが、$\pi$ の値の和が1を超えていて明らかにおかしい。`tfd.Dirichlet`の使い方がおかしいのか、それとも数値最適化には $\pi$ の正規化などの制約は含まれていない (はず) ので、その途中で数値誤差が溜まってしまっているのだろうか。分からない。

{% include plotly/gaussian_mixture_hmc_pi_posterior.html %}

{% include plotly/gaussian_mixture_hmc_pi_chain_plot.html %}

{% include plotly/gaussian_mixture_hmc_mu1_posterior.html %}

{% include plotly/gaussian_mixture_hmc_mu1_chain_plot.html %}

{% include plotly/gaussian_mixture_hmc_mu2_posterior.html %}

{% include plotly/gaussian_mixture_hmc_mu2_chain_plot.html %}

{% include plotly/gaussian_mixture_hmc_var_posterior.html %}

{% include plotly/gaussian_mixture_hmc_var_chain_plot.html %}

### 変分推論

TODO
