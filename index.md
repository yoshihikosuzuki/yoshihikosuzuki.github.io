---
layout: default
title: Home
redirect_to:
  - https://yoshihiko-suzuki.netlify.com/
---

## 最近のブログ投稿

{% for post in site.posts limit:5 %}
### [{{ post.title }}]({{ post.url }})

{{ post.date | date_to_string }}

{{ post.excerpt }}

{% endfor %}

<br>

&#8811; [すべてのブログ投稿を見る]({% link blog/index.html %})

<br>


## 固定記事

{% assign knowledges = site.knowledge | sort:"order" %}
{% for post in knowledges limit:5 %}
### [{{ post.title }}]({{ post.url }})
{% endfor %}

<br>

&#8811; [すべての固定記事を見る]({% link knowledge.md %})
