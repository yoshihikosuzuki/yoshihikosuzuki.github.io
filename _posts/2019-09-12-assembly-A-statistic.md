---
layout: post
title: ゲノムアセンブリの A-statistic
---

ほとんど自分用メモ。[Myers, E. W. A Whole-Genome Assembly of Drosophila. *Science*  287, 2196–2204 (2000)](https://science.sciencemag.org/content/287/5461/2196) にある "A-statistic" (ググラビリティが低い) について。

* Given: $N$ 個の (途切れていない) リード
* Given: 長さ $G$ bp のゲノム
* Given: (平均) リード深度 $d$

このとき、「平均リード深度が $d$ のときに $\rho$ bp の区間中に $k$ 個のリードが現れる確率」= 「長さ $\rho$ bp のコンティグが $k$ 個のリードから構成される確率」を $p(k\vert d)$ と書くと、

$$
p(k\vert d)={\rm Poisson}\left(k;\frac{d\rho N}{G}\right)
$$

となる。そして、これをもとにオッズ比

$$
\frac{p(k\vert d=1)}{p(k\vert d=2)}
$$

の log を取った値が 10 以上ならその $\rho$ bp の区間 (= コンティグ) はユニークであるとする、という話。これはコンティグがリピートを含んでいるかどうかの判定なので、アセンブリの "正しさ" はまた別問題となる (A-statistic の値が小さくてもアセンブリが正しいこともあるし、大きくてもミスアセンブリがあることもある)。
