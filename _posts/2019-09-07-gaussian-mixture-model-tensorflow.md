---
layout: post
title: Tensorflow (Probability) で混合ガウスモデル
plotly: true
---

TensorFlow (version 1.4), TensorFlow Probability, Edwards2 の勉強のために、最尤推定とベイズ推定の各種解法で、潜在変数ありの場合に代表的な混合ガウスモデルを解く。潜在変数なしの[線形回帰はこちら]({% post_url 2019-09-06-linear-regression-tensorflow %})。

[Jupyter Notebook はここ](https://nbviewer.jupyter.org/gist/yoshihikosuzuki/9d06ebb320789dd1a0c2389964a2d33e)。Plotly まわりのために [BITS](https://github.com/yoshihikosuzuki/BITS) という自作パッケージを使っているので、コードを動かす場合はインストールする。

Tensorflow 関連のインポートは以下の通り。Eager Execution は使用しない。`edward2`で事足りたので`tfd = tfp.distributions`は使わなかった。一応どちらでも書けるらしい。

```python
import tensorflow as tf
import tensorflow_probability as tfp
from tensorflow_probability import edward2 as ed
```

## モデル

## データ生成

## 最尤推定

### EMアルゴリズム

## ベイズ推定

### ギブスサンプリング

### ハミルトニアンモンテカルロ法

### 変分推論
