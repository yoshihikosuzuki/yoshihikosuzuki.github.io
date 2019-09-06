---
layout: post
title: GitHub Pages で作ったサイトに Algolia で検索機能をつける
---

基本的に[公式ページ](https://community.algolia.com/jekyll-algolia/getting-started.html)もしくは[この記事](https://aloerina01.github.io/blog/2018-10-11-1)がすごく分かりやすくて、ほとんどその通りにやれば大丈夫。ただ、GitHub Pages はデフォルトだと`$ git push`してから GitHub 側で Jekyll が実行されて静的サイトに変換されるが、Algolia の検索のためのインデックスを作るのにローカルで Jekyll を実行できないといけないので、そこだけ注意する。

## インデックスを作るために Jekyll をローカルで動かせるようにする

[上の記事](https://aloerina01.github.io/blog/2018-10-11-1)にない部分だけ書くと、

* サイトのプロジェクトディレクトリで`$ bundle init`して`Gemfile`を作る
* `Gemfile`に`gem "github-pages", group: :jekyll_plugins`を追記する。初期化の際に自動で書かれた部分や Algolia のための部分も含めると↓のようになる。

```
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

gem 'jekyll', '~> 3.6'

group :jekyll_plugins do
  gem 'jekyll-algolia'
end
```

* (`$ bundle install`した時に Jekyll のバージョン云々のエラーが出た場合は、`$ bundle update`しないといけないかも)
* `_site/`はビルド結果であり Git で管理する必要はないので、`.gitignore`に追加しておく

これで`$ bundle exec jekyll *`が動くようになる。`$ bundle exec jekyll serve`とすれば、静的サイトがローカルに生成され、ローカルサーバー上でサイトを見ることができる。しかも一度起動しておけばファイルに変更を加えると動的にサイトが再生成されるので、毎回`$ git push`するよりも開発にとても便利。

## インデックスを作った後のフロントエンド実装

Algolia でインデックスを作った後は、今回は[公式ページ](https://community.algolia.com/jekyll-algolia/blog.html)のやり方に従うことにする。つまり、instantSearch.js を使ったインクリメンタルサーチを実装する。ただし、公式ページの実装では、

* 検索用の専用ページを用意して、
* そこにサイト内の記事一覧を表示してから、
* 検索窓にクエリが投げられるたびに検索結果をフィルタする

という仕様になっている。今回は個人的な好みからこれを少し変更して、

* 任意のページで、
* デフォルト(クエリが空文字列の時)では検索結果を何も表示せず、
* 検索窓にクエリが投げられるたびに現在のページで表示しているコンテンツの前に割り込んで検索結果を表示する

ようにする。

### HTML の記述

まず、デフォルトで何も表示しないので、`_layouts/default.html`には

```html
<div id="site-search"></div>   <!-- 検索窓 -->

...
<section>
  <div id="search-result">
    <h2>Search Result:</h2>
    <div id="search-hits"></div>   <!-- 検索結果 -->
  </div>
  {% raw %}{{ content }}{% endraw %}
</section>
...

{% raw %}{% include search.html %}{% endraw %}   <!-- bodyの最後で-->
```

だけを追記すればよい。今回は`Search Result`という文字を検索結果の直前に表示する(そしてクエリが存在しない時には表示しない)ために、検索結果のための`search-hits`セレクタとは別にそれを含む`seach-result`セレクタを用意している。

### Javascript (を含む HTML) の記述

そして、処理の中身は`_includes/search.html`に書く。ほとんどが公式の解説ページと同じだが、適宜セレクタの名前が変わっていたりしていることに注意。

```html
<!-- Including InstantSearch.js library and styling -->
<script src="https://cdn.jsdelivr.net/npm/instantsearch.js@2.6.0/dist/instantsearch.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/instantsearch.js@2.6.0/dist/instantsearch.min.css">
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/instantsearch.js@2.6.0/dist/instantsearch-theme-algolia.min.css">

<script>
 // Instanciating InstantSearch.js with Algolia credentials
 var search = instantsearch({
   appId: '{% raw %}{{ site.algolia.application_id }}{% endraw %}',
   indexName: '{% raw %}{{ site.algolia.index_name }}{% endraw %}',
   apiKey: '{% raw %}{{ site.algolia.search_only_api_key }}{% endraw %}',
   searchFunction: function(helper) {
     var searchResults = $('#search-result');
     if (helper.state.query === '') {
       searchResults.hide();
       return;
     }
     $("html, body").animate({scrollTop: 0}, "500");
     helper.search();
     searchResults.show();
   }
 });

 // Adding searchbar and results widgets
 search.addWidget(
   instantsearch.widgets.searchBox({
     container: '#site-search',
     placeholder: 'Search this site',
     poweredBy: true  // This is required if you're on the free Community plan
   })
 );

 search.addWidget(
   instantsearch.widgets.hits({
     container: '#search-hits',
     templates: {
       item: function(hit) {
         return `
          <div class="page-item">
            <h3><a class="page-link" href="{{ site.baseurl }}${hit.url}">${hit.title}</a></h3>
            <div class="page-snippet">${hit.html}</div>
          </div>
         `;
       }
     }
   })
 );

 // Starting the search
 search.start();
</script>
```

そしてもう一点、`search`変数に`searchFunction`が追加されている。これはクエリが空の時に検索結果を表示しないようにするためで、これも[公式の解説](https://community.algolia.com/instantsearch.js/v1/documentation/#hide-results-on-init)に従っている(クエリが打ち込まれたらページの先頭に移動する部分は付け加えた)。

### その他

CSS は好きなように調整する。

あとは、今回`<h2>Search Result:</h2>`を検索結果の前に表示するようにしているが、Leap Day Theme を使っている場合、これが(検索していない状態でも)ナビゲーションバーに追加されてしまう。これはよくないので、少し強引だが以下のように`/assets/js/main.js`を修正して、この名前のセクションはナビゲーションバーに含めないようにした。

```javascript
$(function() {
  $("section h1, section h2, section h3").each(function(){
    if ($(this).text() == "Search Result:") return;
    ...
```
