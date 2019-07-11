---
layout: knowledge
title: よく使うコマンドやテンプレート達
order: 100
---



## Emacs

* 複数行挿入: 範囲の先頭で `C-x space` -> 範囲の末尾に移動して `C-t` -> 文字入力
* タグジャンプ: `M-.`



## Homebrew

* `$ brew doctor`
* `$ brew upgrade`: Homebrew 本体とパッケージのアップデート
* `$ brew install PACKAGE`, `$ brew uninstall PACKAGE`, `$ brew list`



## Git & GitHub

[Gitのあらゆるトラブルが解決する神ノウハウ集を翻訳した](https://blog.labot.jp/entry/2019/07/01/183204)



## Jupyter Notebook

```python
%matplotlib inline
%config InlineBackend.figure_format = "retina"
from IPython.display import display
import plotly.offline as py
py.init_notebook_mode(connected=False)
import logging
import logzero
logzero.loglevel(logging.INFO)
```

- `display`は例えばセルの途中で(ループの中でとか) pandas.DataFrame を表形式で表示したい時とかに使う
- リモートサーバから X11 Forwarding して使うことだけを想定しているので、Plotly はオンライン限定
- ログ表示には [logzero](https://logzero.readthedocs.io/en/latest/) を使用、`loglevel`は状況に応じて`DEBUG`に変える

* カスタム CSS は `$HOME/.jupyter/custom/custom.css`



## Typora

* width: 1400px