---
layout: post
title: Bloom filter
---

* Given: Bloom filter (BF) のサイズ $N\in\mathbb{N}$
* Given: $K$ 個のハッシュ関数 $$H=\{h_k:\Sigma^*\rightarrow[1..N]\}_{k=1,\cdots,K}$$

このとき、BF $b={\rm BF}(N, H)$ は、以下の2つの操作が定義された長さ $N$ のビットベクトル(初期値は0)である。

* add 操作: 任意の文字列 $s\in\Sigma^*$ を受け取り、$b$ の $$\{h(s)\}_{h\in H}$$ 番目のビットを1にする
* find 操作: 任意の文字列 $s\in\Sigma^*$ を受け取り、$b$ の $$\{h(s)\}_{h\in H}$$ 番目のビットがすべて1なら真を、そうでなければ偽を返す

つまり、任意の文字列は $H$ によって、長さ $N$ のビットベクトル中の $K$ 個のビットフラグとして表現される。各文字列を表すフラグ列は重複が許されているので、find 操作は false positive を含む。一方で false negative rate は必ず0である。

BF の false positive rate $c$ については以下が成り立つ。

$$
c=\left(1-\left(1-\frac{1}{N}\right)^{KM}\right)^K
$$

ここで、$M$ は追加したクエリの数である。したがって、

* Given: 目標とする false positive rate $\tilde{c}$
* Given: クエリ数の推定値 $\tilde{M}$

に対する BF のサイズ $N$ およびハッシュ関数の数 $K$ は以下に基づいて設定すればよい。

$$
N\sim\frac{-K\tilde{M}}{\ln(1-\tilde{c}^{\frac{1}{K}})}
$$

BF は Approximate Member Query (AMQ) を実現する(確率的)データ構造の1つである。



## 発展

### Counting Filter (CF)

BF $b$ をビットベクトルから正整数のベクトルに変更し(初期値はすべて0)、

* add 操作の「ビットを1にする」を「要素に1足す」に、
* find 操作の「ビットがすべて1なら」を「要素がすべて$>0$なら」に、

それぞれ変更すると、

* delete 操作: 任意の文字列 $s\in\Sigma^*$ を受け取り、$b$ の $$\{h(s)\}_{h\in H}$$ 番目の要素を1減らす

を定義することができる。$b$ のサイズは大きくなる。

### Quotient Filter (QF)

https://arxiv.org/abs/1208.0290

CQ よりも高空間効率

### Rank-and-Select-based Quotient Filter (RSQF)

https://dl.acm.org/citation.cfm?id=3035963

下の CQF のための準備的定義

### Counting Quotient Filter (CQF)

https://dl.acm.org/citation.cfm?id=3035963

おそらく現状最も時間・空間効率の良い AMQ のデータ構造