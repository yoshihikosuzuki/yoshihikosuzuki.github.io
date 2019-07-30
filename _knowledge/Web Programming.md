---
layout: knowledge
title: Web プログラミング(フロントエンド)覚書
order: 230
---

[2017年のJavaScript開発で知っておきたい用語集/リンク集](https://qiita.com/tomoyamachi/items/b398f35882fb57b975ad)



## Javascript & Node

- [イマドキのJavaScriptの書き方2018](https://qiita.com/shibukawa/items/19ab5c381bbb2e09d0d9)
- [JS ライブラリ、jQuery プラグインまとめ](http://coliss.com/articles/build-websites/operation/javascript/best-javascript-libs-jquery-plugins-2016.html)
- [Node.js 標準モジュール](http://yohshiy.blog.fc2.com/blog-entry-310.html)



## npm (Node Package Manager)

- [npmコマンドの使い方](https://qiita.com/yoh-nak/items/8446bf12094c729d00fe)



### 新規プロジェクトの作成

1. (GitHub にレポジトリ作成、ローカルに clone)
2. レポジトリの root で`$ npm init -y` (`-y`は非対話モード)すると、`package.json`が作成される



### パッケージのインストール

- `node_modules/`にインストールしたモジュールや実行ファイルには自動でパスが通るので、後述の npm scripts や`require()`ではプレフィックスは不要

| コマンド                                | インストール先    | `package.json`との関係                                       | 用途                                |
| --------------------------------------- | ----------------- | ------------------------------------------------------------ | ----------------------------------- |
| `$ npm install -g パッケージ名`         | 環境全体          | 依存関係には追加されない([が、記述すべき](https://qiita.com/Jxck_/items/efaff21b977ddc782971#%E3%83%84%E3%83%BC%E3%83%AB%E3%82%82-packagejson-%E3%81%A7)) | 頻繁に使用するパッケージ？          |
| `$ npm install --save-dev パッケージ名` | `./node_modules/` | `devDependencies`にパッケージ名を追加                        | 開発時にだけ使用するパッケージ      |
| `$ npm install --save パッケージ名`     | `./node_modules/` | `dependencies`にパッケージ名を追加                           | 実行時に(も)使用するパッケージ      |
| `$ npm install`                         | `./node_modules/` | 記述されている依存パッケージを全てインストール               | 既存レポジトリを clone した場合など |

- `$ npm outdated [-g|--save|--save-dev]`で現在インストールされているバージョンと最新のバージョンを確認できる
  - アップデート自体はインストールと同じコマンドで可能



### npm scripts

* `package.json`中の`"scripts"`で定義されたコマンド群のこと
* `$ npm run`で一覧を表示できる
* 以下のような記述のとき、`タスク名` = `install`, `start`, `test`等なら`$ npm タスク名`で、その他(`build`等)は`$ npm run タスク名`で、`コマンド`を実行可能

```json
"scripts": {
    "タスク名": "コマンド"
}
```



## Electron

### Hello, World

1. `$ npm init -y`で新規プロジェクトを作成
2. [公式 Quick Start](https://electronjs.org/docs/tutorial/quick-start) に従って`main.js`と`index.html`をコピペ
   - `package.json`中の`"main"`は上の`main.js`に変更しておく
3. `$ electron .`で実行
   - npm script で`"start": "electron ."`としておけば、`$ npm start`でも OK



### Visual Studio Code で開発・デバッグできるようにする

1. (グローバルではなく)レポジトリに Electron をインストール
2. VSC に拡張機能`Debugger for Chrome`をインストール
3. [Electron debugging (main and renderer process)](https://github.com/Microsoft/vscode-recipes/tree/master/Electron) の "Configure launch.json File" 以下に従って`.vscode/launch.json`を作成し、実行(F5)



### Electron 実行時の処理の流れ

1. `electron DIR_NAME`すると、` DIR_NAME/package.json`の`"main"`で指定されている js ファイル(ここでは`main.js`)が実行される
   * 作業ディレクトリは`DIR_NAME`
2. `app.on('ready', …)`の中で`createWindow`もしくはそれと同等の関数が呼び出され、ウィンドウを生成
3. `createWindow`の中で`electron.BrowserWindow`インスタンスの`loadURL()`を使って`index.html`が読み込まれる



### アプリケーション実行ファイルの生成

- [electron-packager](https://github.com/electron/electron-packager) を使う(`$ npm install -g electron-packager`)



## Webpack

- `$ npm install --save-dev webpack webpack-cli`
- [webpack 4 入門](https://qiita.com/soarflat/items/28bf799f7e0335b68186)
- 複数ファイルに分割して開発された JS, CSS を1つにまとめる(ビルド or モジュールバンドル)
- Electron と使う場合は`target:electron-main`や`target: electron-renderer`を指定しないとエラーになる



## Babel

- `$ npm install --save-dev babel-loader @babel/core @babel/preset-env`
  - React と使う場合は `$ npm install --save-dev @babel/preset-react`も
- トランスパイラ
  - 実際にトランスパイルするには元の言語をプラグインで指定する必要がある
  - React のようなフレームワーク用の決まったプラグイン集合はプリセットで簡単に指定できる
- [コンフィグファイル](https://babeljs.io/docs/en/configuration#babelconfigjs)の名前と中身は用途によって変わる
  - Electron (Node) なら`babel.config.js`
- Webpack と使う場合は、`webpack.config.js`で`babel-loader`をローダーに指定して、プリセットの指定は以下のどちらかで行う(cf. [Babelのpresetsを設定する2つの方法](https://qiita.com/tmiki/items/86abc565d06ced78d968))
  - `webpack.config.js`に書く場合は`options`で指定する
  - `.babelrc` (not `babel.config.js`)に書く(こちらの方が複数の対象について1つで済むため良さそう)
- `webpack.config.js`をトランスパイルしたい場合は、`$ npm install --save-dev @babel/register`して、`webpack.config.js`を`webpack.config.babel.js`に変える



## React + Redux

- `$ npm --save install react react-dom redux react-redux`
- [React+Redux入門](https://qiita.com/erukiti/items/e16aa13ad81d5938374e)
- [Electron+React+Reduxで作るレトロなエクスプローラのハンズオン(チュートリアル)](https://qiita.com/tashxii/items/290a3421d520bdae0c36)
- 

