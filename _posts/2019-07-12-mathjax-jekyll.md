---
layout: post
title: Jekyll (+Kramdown) で Mathjax
---

Mathjax の導入自体は特に難しくない。[公式サイト](https://www.mathjax.org/)の説明通り`_layout/default.html`に以下を追加。

```javascript
<script src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML' async></script>
```



デフォルトだとインライン数式は`$$`で囲まないといけない。これを`$`に変更するには以下を追加。

```javascript
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      processEscapes: true
    }
  });
</script>
```



また、Jekyll や Kramdown の文法との衝突でいくつか通常の LaTeX が表示されない。

* `|`は表の区切りとして解釈されてしまうので、代わりに`\vert`や`\mid`を使う(cf. [https://github.com/gettalong/kramdown/issues/46](https://github.com/gettalong/kramdown/issues/46))
* `\{`,`\}`は Liquid として扱われ表示されない。`$$`で囲むと表示される
* `\|`(二重縦棒; ノルム等)は一重縦棒で表示されてしまうので、代わりに`\parallel`を使う(意味が違うので少しモヤモヤするが。。)
* (インラインでない)数式ブロックは Typora だと`$$`で囲まれるだけなので、直前と直後に空白行が無いとインライン数式として認識されてしまう。かといって空白行を前後に挟むと Typora での見栄えが悪くなる。これを解決するには、Typora で編集した後、Markdown ファイルをコマンドラインエディタで直接編集して数式ブロックの前後に空白行を挿入する