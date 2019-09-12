---
layout: post
title: MinHash と Jaccard similarity の関係
---

* Given: 2つの集合 $X,Y$
* Def: Jaccard similarity ${\rm Jaccard}(X,Y)=\vert X\cap Y\vert/\vert X\cup Y\vert$

## 0/1-hash

* Given:  集合族 $S=\{S_i\}$
* Def: 全要素 $E=\bigcap S_i$
* Given: 全要素の並び順 $p$

このとき、集合 $S_i$ に対する 0/1-hash $h(S_i, p)$ は、「$p$ の順に全要素を見ていったときに、一番最初に $S_i$ に属している要素」と定義される。

この 0/1-MinHash について成り立つ重要な性質が、

「$p$ がランダムなら、任意の $S_i,S_j$ に対して ${\rm P}(h(S_i, p)=h(S_j,p))={\rm Jaccard}(S_i,S_j)$」

である。証明は

1. 全要素を $S_i,S_j$ の「A: 両方に含まれる」、「B: 片方に含まれる」、「C: どちらにも含まれない」の三種類に分ける
2. このときタイプ C は無視してよくて、
3. 残り (A + B) のうち一番最初にタイプ A を引く確率を考えればよい。

0/1-hash という名前は勝手に付けた。$h$ は各要素についてその集合に属していれば1、そうでなければ0という写像になっているから。

## MinHash

ランダムな $p$ を生成するのは時間がかかる。本質的なのは「比較する要素がランダムに選ばれること」なので、

* Given: 要素に対するハッシュ関数 $\tilde{h}: E\rightarrow\mathbb{N}$
* Def: 集合 $S_i$ に対する $\tilde{h}$ の最小値 $$h(S_i)=\min{\{\tilde{h}(e)\mid e\in S_i\}}$$

として、$\tilde{h}$ が「性能の良い」ハッシュであれば、同様に ${\rm P}(h(S_i)=h(S_j))={\rm Jaccard}(S_i,S_j)$ が成り立つ。

## (通常の) MinHash

ハッシュ関数の数を増やすと、サンプリング回数を増やすことになり、Jaccard similarity の推定値の分散が減る。

* Given: $N$個の独立したハッシュ関数 $\tilde{h}_n: E\rightarrow\mathbb{N}$

このとき、Jaccard similarity の推定値は、${\rm Jaccard}(S_i, S_j)\sim \sum_n\delta_{h_n(S_i),h_n(S_j)}/N$ になる ($\delta$ はクロネッカーのデルタ)。

## Locality Sensitive Hashing

MinHash は [Locality Sensitive Hashing (LSH)](https://ja.wikipedia.org/wiki/局所性鋭敏型ハッシュ) の1種と言える。LSH は距離が近い2点で同じ値を取りやすいハッシュ関数を用いた近傍探索。

* Given: 距離 $d$ の定義された空間 $X$
* Given: 近傍の閾値 $R>0$ と近似因子 $c>1$

このとき、LSH で用いるハッシュ関数 $h$ が満たすべき性質は、

* $P_2<P_1$, where
* $\forall p,q\in X;d(p,q)\leq R\Rightarrow {\rm P}(h(p)=h(q))\geq P_1$ and
* $\forall p,q\in X;d(p,q)\geq cR\Rightarrow {\rm P}(h(p)=h(q))\leq P_2$

簡単な例は、ハミング距離の定義された空間($=X$)における、その部分空間への正射影($=h$)。

## Nearest Neighbor Search

すでに書いたが、LSH は [Nearest Neighbor Search (NNS; 最近傍探索)](https://ja.wikipedia.org/wiki/最近傍探索) に対するアプローチの一種。

* データが存在するノルム空間の多様性、および
* 次元の呪い

から、これまで NNS に対する一般のアルゴリズムは悲観的に思われていたようだ(=対象となるデータのノルム空間に応じたアルゴリズムを設計する必要がある)が、2018年に発表された [Data-dependent hashing via nonlinear spectral gaps](https://dl.acm.org/citation.cfm?id=3188846) という論文が「高次元ノルム空間における[非線形スペクトルギャップ](http://geometry.mail-box.ne.jp/pdf.bak/12-kondo.pdf)を LSH に一般的に落とし込むことで、(approximate) NNS に対する新しいアプローチを与えた」ということで最近注目を浴びているらしいので、いつか結果だけでも理解したい。
