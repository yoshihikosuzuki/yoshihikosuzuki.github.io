---
layout: post
title: Jekyll (GitHub Pages) でページに Plotly の図を埋め込む
plotly: true
---

タイトルの通り、Plotly の interactive plot をどうやって Jekyll のページ上で表示するかという話。Plotly のサーバ上にプロットを保存してそのリンクを含んだ`<iframe>`で埋め込むこともできるはずだが、無料でサーバ上に保存できるプロットの数は限られているのであまり使いたくない。そこで、

1. HTML ファイルにプロットを出力して、
2. そのファイルを`_includes/`ディレクトリの下に置いて、
3. Liquid を使ってページに埋め込む

という方法を取ることにした。

### 1. Plotly ライブラリの読み込み

まず、Plotly のプロットを描くにはライブラリが必要だが、プロットの出力 HTML ごとにこれを含めるのは無駄なので、ページの YAML Front Matter で`plotly: true`としたページ (だけ) で Plotly ライブラリを読み込むようにする。具体的には、`_layouts/default.html`の`<head>`内に以下を追記する。`<body>`内でないのは、先にライブラリが読まれていないと描画してくれないから。

```html
{% raw %}{% if page.plotly %}{% endraw %}
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
{% raw %}{% endif %}{% endraw %}
```

### 2. Plotly プロットを HTML に保存

Plotly のプロットを HTML で保存する方法は昔のバージョンと今のバージョンで変わっていることに注意。バージョン4では、`py.iplot()`からは画像しか出力できず、HTML の出力は`go.Figure`オブジェクトの`.write_html()`メソッドを使う必要がある。3MB 程度ある Plotly ライブラリをプロットに含めないために`include_plotlyjs=False`とする。

```python
import plotly.graph_objects as go
fig = go.Figure(...)
fig.write_html(file="plot.html", include_plotlyjs=False)
```

プロットの HTML ファイルを生成したら、それを`_includes/`以下のどこかに置いておく。ここでは`_includes/plotly/plot.html`とする。

### 3. マークダウンに埋め込み

そうしたら、Jekyll の記事のマークダウンファイル内部で、YAML Front Matter に以下を追記し、

```yaml
plotly: true
```

あとは任意の位置に以下の Liquid 文を挿入することで図を読み込むことができる。

```liquid
{% raw %}{% include plotly/plot.html %}{% endraw %}
```

### 埋め込み例

{% include plotly/plot_example.html %}
