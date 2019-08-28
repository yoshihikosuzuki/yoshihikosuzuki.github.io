---
layout: knowledge
title: たまによく使う(？)コマンドやテンプレート
order: 100
---

## Emacs

* 複数行挿入: 範囲の先頭で `C-x space` -> 範囲の末尾に移動して `C-t` -> 文字入力
* タグジャンプ: `M-.`
* MEPLA でインストール: `M-x package-install RET パッケージ名` or `M-x list-packages RET` -> `I` -> `X`

## VSCode

* 自動インデント: `Alt + Shift + F`

## Jupyter Notebook

* 以下のテンプレートを拡張機能の [Snippets Menu](https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/nbextensions/snippets_menu/readme.html) で登録
   * `display`は例えばセルの途中で(ループの中でとか) pandas.DataFrame を表形式で表示したい時とかに使う
   * [Plotly](https://plot.ly/python/) はバージョン4を想定
   * ログ表示には [logzero](https://logzero.readthedocs.io/en/latest/) を使用、`loglevel`は状況に応じて`DEBUG`に変える

```python
%matplotlib inline
%config InlineBackend.figure_format = 'retina'
from IPython.display import display
import plotly.offline as py
py.init_notebook_mode(connected=True)
import plotly.io as pio
pio.templates.default = 'plotly_white'
import logging
import logzero
logzero.loglevel(logging.INFO)
```

* 関数・クラスの名前の上で`Shift + Tab`で init signature 表示
* カスタム CSS は `$HOME/.jupyter/custom/custom.css`

## SGE

* `qstat -f`: 全ノードの状態を表示(`qtop` -> `s`と同じ)

## Git & GitHub

[Gitのあらゆるトラブルが解決する神ノウハウ集を翻訳した](https://blog.labot.jp/entry/2019/07/01/183204)

## Homebrew

- `$ brew doctor`
- `$ brew upgrade`: Homebrew 本体とパッケージのアップデート
- `$ brew install PACKAGE`, `$ brew uninstall PACKAGE`, `$ brew list`

## Typora

* width: 1400px

## Python

* [yapf - A formatter for Python files](https://github.com/google/yapf)
* [2to3](https://docs.python.org/ja/3/library/2to3.html)




