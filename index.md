---
layout: default
title: Home
---

## 最近の投稿

{% for post in site.posts limit:5 %}
### [{{ post.title }}]({{ post.url }})

{{ post.date | date_to_string }}

{{ post.excerpt }}

{% endfor %}
-> [すべての投稿を見る]({% link blog/index.html %})


## 代表記事

{% assign knowledges = site.knowledge | sort:"order" %}
{% for post in knowledges limit:5 %}
### [{{ post.title }}]({{ post.url }})
{% endfor %}

-> [すべての記事を見る]({% link knowledge.md %})
