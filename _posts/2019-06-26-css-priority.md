---
layout: post
title: CSS の反映優先順位
---

ある DOM 要素に対して複数の対立する CSS 属性が定義されている場合、その要素から最も近い場所での定義が優先される。



なので、例えば`<a>`全体に対して

```css
a {
  color: #4276b6;
}
```

のように青色が定義されているときに、ある1つの`<a>`の色を`#f3f3f3`(白色)に変えたくなったら、新しく`id`(もしくは`class`)タグを付けてやって、

```html
<a href="/path/to/link" id="hoge">Link</a>
```

```css
#hoge {
  color: #f3f3f3;
}
```

とすればよい。



あと、GitHub Pages (というか Jekyll) では、追加の CSS は`/assets/css/style.css`に記述すればよいのだが、オリジナルの CSS を修正したい場合は`https://github.com/pages-themes/THEME_NAME`(`THEME_NAME`は使っているテーマの名前、私の場合は`leap-day`)から`/_sass/*.scss`をコピーしてきて同じディレクトリに置いて編集する必要がある。



私の場合はコードブロックのフォントを Lucida Sans から Monaco へ変更したりするためなどにこれを行う必要があった。SCSS の変数(`$`から始まるもの)であれば`/assets/css/style.css`からでも変更できるようなのだが、そうでなくて値が直接指定されているときなどはこうするしかないように思う。



(ちなみに CSS の値を変えてページの見た目を(微)調整したい時には Google Chrome のデベロッパーツールがめちゃくちゃ便利。。おそらく Web 界隈では常識なのだろうけど、リアルタイムで各種属性の値を変更してその影響を確認できる。すごい。)

