---
layout: default
title: Home
---

## 最近のブログ投稿

{% for post in site.posts limit:5 %}
### [{{ post.title }}]({{ post.url }})

{{ post.date | date_to_string }}

{{ post.excerpt }}

{% endfor %}
-> [すべての投稿を見る]({% link blog/index.html %})



## 最近の記事

{% for post in site.knowledge limit:5 %}
### [{{ post.title }}]({{ post.url }})

{{ post.excerpt }}

{% endfor %}
-> [すべての投稿を見る]({% link knowledge.html %})