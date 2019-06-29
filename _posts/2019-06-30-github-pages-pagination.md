---
layout: post
title: GitHub Pages でページ区切り
---

経緯は省略するが、jekyll-paginate-v2 を使うのに色々やった結果、Travis CI 周りで嫌になって最終的に諦めて GitHub Pages がデフォルトでサポートしている jekyll-paginate を使うことにした。やってみると機能的にはこちらでも十分なことに気が付いた。。



これも基本的に[公式ページ](https://jekyllrb.com/docs/pagination/)だけで事足りるが、一点だけ分かりにくかったので書く。公式ページでは`/index.html`以外のファイルを paginate するやり方がよく分からないが、[これ](https://stackoverflow.com/questions/46182805/how-to-use-jekyll-paginate-without-index-html?rq=1)によると、例えば`/blog.html`を paginate したい場合は、`/blog/index.html`とするだけで良いとのこと。そう言われると公式ページの注意書きも理解できるような、、？



あとはナビゲーションやリンクの名前を書き換えて、スタイルをいじれば完了。

