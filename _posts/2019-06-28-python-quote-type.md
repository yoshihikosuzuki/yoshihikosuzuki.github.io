---
layout: post
title: Python の文字列はシングルクオートかダブルクオートか？
---

[PEP8](https://www.python.org/dev/peps/pep-0008/) はどちらも同じとしている。

> In Python, single-quoted strings and double-quoted strings are the same. This PEP does not make a recommendation for this. Pick a rule and stick to it. When a string contains single or double quote characters, however, use the other one to avoid backslashes in the string. It improves readability.
>
> For triple-quoted strings, always use double quote characters to be consistent with the docstring convention in [PEP 257](https://www.python.org/dev/peps/pep-0257).

私はダブルクオートを推したい。なぜなら、以下のような理由で文字列そのものにシングルクオートを含めることがあっても、ダブルクオートを含めたい状況はあまりない(と思っている)からだ。

* 英語の文章でシングルクオートをアポストロフィー代わりに使う
* シェルコマンドの文字列を書く時にシングルクオートでないと中身が展開されてしまう(Python の中でシェルスクリプトを書くなという話かもしれないが)

あとは C/C++ の名残で「文字列はダブルクオート」という観念が染み付いているのもあるかもしれない。



ただ、ダブルクオートを使いたいという場面もあるのも事実なので、プロジェクト内で統一されていれば十分というありきたりな結論でやはり落ち着く。



ちなみに、最近発表された[V言語](https://vlang.io/)では文字列はシングルクオート強制になっている。

