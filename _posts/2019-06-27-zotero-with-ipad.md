---
layout: post
title: Zotero で管理している PDF を iPad/モバイル端末から閲覧・編集する
---

文献管理ソフトの1つであるところの [Zotero](https://www.zotero.org/) は PC 版だと使いやすいのだけど、別の端末に同期させようとすると少々面倒な話になってくる。



## 前提

* PC (Mac, Windows)で Zotero を使って論文などの PDF を管理している
* iPad などのタブレットやモバイル端末からもその PDF にアクセスしたい
* Zotero Storage (アカウントを作ると 300MB まで無料の同期用クラウドストレージがもらえるやつ) を使わない
* 特定の PDF リーダに対してこだわりがない、むしろデバイスのデフォルトの PDF リーダを使いたい



最後の2つの条件の理由は、一言で言うとつまり「特定のソフトウエアに依存したくない」ということだ。Zotero Storage を使うと確かに楽かもしれないが、Zotero Storage のサービスの及ぶ範囲でしかファイルを共有することはできない(これはクラウドサービス全般に対して言える)。また、Zotero 以外の文献管理ソフトにありがちな内蔵 PDF リーダも、確かに便利なのかもしれないが、その特定のソフトに対する依存性を強めてしまい(注釈の形式など)、ふと別のデバイスでも使いたくなった時にサポートしていない、なんてことになりがちだ。



## Zotfile + Dropbox + Acrobat Reader

まず、Zotero Storage を使わないので、別の何らかの方法で PC 上のファイルを共有する必要がある。ファイル共有といえば定番の Dropbox ということでここでは挙げたが、要は共有したいデバイスの PDF リーダからファイルにアクセスできるようなサービスであれば何でもよい。



じゃあ単純に Zotero Data Directory Location (PC 上で Zotero のデータが保存される場所) を Dropbox の支配下に置くだけで済むのか簡単じゃん、と言うと残念ながらそうはいかない。この Data Directory Location にある`storage`というディレクトリを見れば分かるのだが、Zotero はそれぞれのアイテムを人工的なハッシュ値を名前に持つディレクトリに入れて管理している。Zotero 公式のファイル同期サービスを使わない限り PC 版のようにこれを綺麗に並べることはできず(特に暗号化されているわけでもなさそうなので SQL を読めばいけるかもしれないが)、この無機質な名前のディレクトリを1つ1つ開いて目的のファイルを探す羽目になる。それは非常にいただけない。



そこで、有名な [Zotfile](http://zotfile.com/) を使って、PC 版 GUI のコレクションの構造と名前を保ったままファイルを管理できるようにする。具体的には、[手順](http://zotfile.com/#how-to-install--set-up-zotfile)に従って Zotfile をインストールした後、`Tools -> Zotfile Preferences -> General Settings`から`Custom Location`を Dropbox が管理できるディレクトリ名で指定して、`Use subfolder defined by`を`/%c`にしてチェックを入れる。そして、Zotero 本体の`Preferences -> Advanced -> Files and Folders`でも`Base directory`を同じ Dropbox のディレクトリで指定する(Data Directory Location はそのまま)。



これで、PC 版 Zotero でモバイルデバイスと同期したいアイテムを右クリック -> `Manage Attachments -> Rename Attachments`で、Data Directory Location から上で指定した Custom Location に「コレクションの名前と構造を保ったまま」ファイルが移動するようになる。注意点としては、

* 同期したいファイルをいちいち右クリック -> … しないといけない(新しく Zotero に追加したファイルは Custom Location ではなくまず Data Directory Location の方に置かれる)
* [ここ](https://forums.zotero.org/discussion/74208/zotfile-not-scanning-folder-for-new-files)では Chrome の拡張機能の Zotero Connector であれば追加時に自動で Custom Location の方に置かれる、と言っているのだが、どうも私の環境だとできない

とはいえ元の状況よりは圧倒的に便利になるので(読みたいものだけ同期できるとポジティブに考えれば逆に良いかも？)、私はひとまずこれで満足している。



ファイルを Custom Location に移動した後は、Dropbox で共有して別端末でそれを任意の PDF リーダで開くだけ。Adobe Acrobat Reader のような標準的かつ無料のビューワを使えば、どのデバイスから注釈などを付けたとしても同期しやすいだろう。(ちなみに私は Mac では動作の非常に軽いプレビューをデフォルトの PDF リーダに設定している。これでも同じように閲覧・編集できる。)

