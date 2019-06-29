---
layout: post
title: GitHub Pages (Jekyll) の Leap Day Theme でナビゲーションに日本語セクション名を使えるようにする
---

[このページ](https://teratail.com/questions/128610)の質問内容と全く同じことを別の(おそらくより適切な)方法で解決しようという話。GitHub Pages の [Leap Day Theme](https://github.com/pages-themes/leap-day) には Table of contents のような機能があり、ページ内にある各セクション`h1`, `h2`, `h3` (マークダウンなら`#`, `##`, `###`)へのリンク一覧がページ毎に自動で作られて、リンクをクリックするとそのセクションの所にスクロールできるようになっている。ところがこの機能はセクション名が日本語だけの場合に動作しない。



その原因は、`/assets/js/main.js`内部の以下のコード。

```javascript
$("section h1, section h2, section h3").each(function(){
  $("nav ul").append("<li class='tag-" + this.nodeName.toLowerCase() + "'><a href='#" + $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'') + "'>" + $(this).text() + "</a></li>");
  $(this).attr("id",$(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));
  $("nav ul li:first-child a").parent().addClass("active");
});
```

これが行なっている処理を大雑把に説明すると、

* 現在のページに含まれている各セクションについて、
  1. その名前を小文字にして、スペースをハイフンに変えて、アルファベット以外の文字を消した文字列をそのセクションの DOM 要素の`id`セレクタとして設定する
  2. その`id`セレクタへのリンクを表(ナビゲーションバー)に追加する

となる。この処理 1. の「アルファベット以外の文字を消」すところが原因となっている(日本語しか含まないセクション名は`id`セレクタが設定されない)。



この質問スレッド内では結局文字コードに変換するという方法で解決しているが、個人的には「`id`セレクタはあくまでリンクの役割を持たせるためだけに存在すればよい」という考えに基づいて以下のようにした。

```javascript
$("section h1, section h2, section h3").each(function(index){
  $("nav ul").append("<li class='tag-" + this.nodeName.toLowerCase() + "'><a href='#toc-" + index + "'>" + $(this).text() + "</a></li>");
  $(this).attr("id", "toc-" + index);
  $("nav ul li:first-child a").parent().addClass("active");
});
```

つまり、セクション名は無視して、セクション毎に一意のセレクタ名として`toc-INDEX` (`INDEX`=1, 2, 3, …) を割り当てている。これなら任意のセクション名に対応できる。正直セクション名が被ることもあるだろうし、こちらを全面的に採用してもいいのではと思ったりする。