---
layout: post
title: Emacs で (company-)jedi を Python3 で使う
---

[このページ](https://archive.zhimingwang.org/blog/2015-04-26-using-python-3-with-emacs-jedi.html)の紹介。emacs でファイルを開いて (company-)jedi が動かず、`M-x jedi:install-server`が`Reason: image not found`というエラーを吐いた時。原因は jedi が使う`virtualenv`が Python2 の(存在しない)ものだったことのようだ。

