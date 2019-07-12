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

