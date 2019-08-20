---
layout: knowledge
title: Web プログラミング(フロントエンド)覚書
order: 230
---

<img src="https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/images/frontend.png" width=800px>

([Roadmap to becoming a web developer in 2019](https://github.com/kamranahmedse/developer-roadmap) より引用)



[2017年のJavaScript開発で知っておきたい用語集/リンク集](https://qiita.com/tomoyamachi/items/b398f35882fb57b975ad)



## Javascript (ES2015 = ES6)

- [イマドキのJavaScriptの書き方2018](https://qiita.com/shibukawa/items/19ab5c381bbb2e09d0d9)



## Node

### npm (Node Package Manager)

* 新規プロジェクト作成
  * `$ npm init -y` (`-y`は非対話モード)
  * `package.json`が作られる

* パッケージのインストール
  * `node_modules/`にインストールしたモジュールや実行ファイルには自動でパスが通るので、後述の npm scripts や`require()`ではプレフィックスは不要

| コマンド                                | インストール先    | `package.json`との関係                                       | 用途                                |
| --------------------------------------- | ----------------- | ------------------------------------------------------------ | ----------------------------------- |
| `$ npm install -g パッケージ名`         | 環境全体          | 依存関係には追加されない([が、記述すべき](https://qiita.com/Jxck_/items/efaff21b977ddc782971#%E3%83%84%E3%83%BC%E3%83%AB%E3%82%82-packagejson-%E3%81%A7)) | 基本的に使わない                    |
| `$ npm install --save-dev パッケージ名` | `./node_modules/` | `devDependencies`にパッケージ名を追加                        | 開発時にだけ使用するパッケージ      |
| `$ npm install --save パッケージ名`     | `./node_modules/` | `dependencies`にパッケージ名を追加                           | 実行時に(も)使用するパッケージ      |
| `$ npm install`                         | `./node_modules/` | 記述されている依存パッケージを全てインストール               | 既存レポジトリを clone した場合など |

- 現在インストールされているバージョンと最新のバージョンを確認
  - `$ npm outdated [-g|--save|--save-dev]`
  - アップデート自体はインストールと同じコマンドで可能

* npm scripts
  * `package.json`中の`"scripts"`で定義されたコマンド群のこと
  * `$ npm run`で一覧を表示できる
  * 以下のような記述のとき、`タスク名` = `install`, `start`, `test`等なら`$ npm タスク名`で、その他(`build`等)は`$ npm run タスク名`で、`コマンド`を実行可能

```json
"scripts": {
    "タスク名": "コマンド"
}
```



### 標準モジュール

* [Node.js 標準モジュール](http://yohshiy.blog.fc2.com/blog-entry-310.html)

* JSON ファイル入力(JSON ファイル -> JSON 文字列 -> JS Object)
  * `const data = JSON.parse(fs.readFileSync(fileName, 'utf8'))`
* JSON ファイル出力(JS Object -> JSON 文字列 -> JSON ファイル)
  * `fs.writeFile(fileName, JSON.stringify(data))`



## CSS, Sass, JS (design)

- [JS ライブラリ、jQuery プラグインまとめ](http://coliss.com/articles/build-websites/operation/javascript/best-javascript-libs-jquery-plugins-2016.html)
- [CSSセレクタのチートシート](https://webliker.info/css-selector-cheat-sheet/)
- [Material-UI](https://material-ui.com/): `$ npm install --save @material-ui/core`
- Node と Sass を使うなら`$ npm install --save-dev node-sass`



## Electron

### Hello, World

1. `$ npm init -y`で新規プロジェクトを作成
2. [公式 Quick Start](https://electronjs.org/docs/tutorial/quick-start) に従って`main.js`と`index.html`をコピペ
   - `package.json`中の`"main"`は上の`main.js`に変更しておく
3. `$ electron .`で実行
   - npm script で`"start": "electron ."`としておけば、`$ npm start`でも OK

4. アプリケーション実行ファイルの生成には [electron-packager](https://github.com/electron/electron-packager) を使う(`$ npm install -g electron-packager`)



### Visual Studio Code で開発・デバッグできるようにする

1. (グローバルではなく)レポジトリに Electron をインストール
2. VSC に拡張機能`Debugger for Chrome`をインストール
3. 一度実行(F5)して`.vscode/launch.json`生成後、[公式ドキュメント](https://electronjs.org/docs/tutorial/debugging-main-process-vscode)に従って内容を変更し、再度実行
   * ビルドはしてくれないので、コードを変更したらターミナルでビルドし直してから再度実行



### Electron 実行時の処理の流れ

1. `electron DIR_NAME`すると、` DIR_NAME/package.json`の`"main"`で指定されている JS ファイル(`main.js`)が Main process として実行される
2. `app.on('ready', …)`の`createWindow`でウィンドウが生成される
3. `createWindow`の中で、`electron.BrowserWindow`インスタンスの`loadURL()`で`index.html`が読み込まれる
4. `index.html`で読み込まれる JS ファイルが Renderer process として実行される



### Main-Renderer プロセス間のやり取り

- プロセス間通信(IPC)を使う
- `ipc`は現在の API には無く、代わりに [ipcMain](https://electronjs.org/docs/api/ipc-main)/[ipcRederer](https://electronjs.org/docs/api/ipc-renderer) を使う(cf. [ElectronのIPCをまとめる](https://qiita.com/gcmae/items/cb6eb18be2f4ffae60b5))
  - `<channel>`は文字列、`<listerner>`は`(event, arg) => {...}`という関数
    - `event.returnValue`に代入すれば同期的に返信(送信側の返り値になる)
    - `event.sender.Send(<channel>[, <args>])`で非同期的に返信(再度`on`で受信)

| Sender -> Receiver (非同期通信) | Method in Sender                                      | Method in Receiver                    |
| ------------------------------- | ----------------------------------------------------- | ------------------------------------- |
| Main -> Renderer                | <BrowserWindow>.webContents.send(<channel>[, <args>]) | ipcRenderer.on(<chennel>, <listener>) |
| Renderer -> Main                | ipcRenderer.send(<channel>[, <args>])                 | ipcMain.on(<channel>, <listener>)     |



### 設定ファイル

* [electron-store](https://github.com/sindresorhus/electron-store) を使う
* デフォルトでは`/Users/USER_NAME/Library/Application\ Support/APP_NAME/config.json`に保存される



## Webpack

- `$ npm install --save-dev webpack webpack-cli`
- [webpack 4 入門](https://qiita.com/soarflat/items/28bf799f7e0335b68186)
- 複数ファイルに分割して開発された JS, CSS, etc. を1つの JS ファイルにまとめる(**モジュールバンドル**)
- Electron と使う場合は`target:electron-main`や`target: electron-renderer`を指定しないとエラーになる
- ローダー
  * `$ npm install --save-dev css-loader mini-css-extract-plugin`: CSS
  * `$ npm install --save-dev sass-loader node-sass`: SCSS
  * `$ npm install --save-dev babel-loader`: Babel



## Babel

- `$ npm install --save-dev @babel/core @babel/preset-env`
  - React と使う場合は `$ npm install --save-dev @babel/preset-react`も
- トランスパイラ
  - 変換したい言語に合わせた**プラグイン**をコンフィグファイル(`.babelrc`等)中に指定する必要がある
  - React のようなフレームワークには必要なプラグイン集合が**プリセット**で用意されていて、簡単に指定できる
- Webpack と使う場合は、`webpack.config.js`で`babel-loader`をローダーに指定して、プリセットの指定は以下のどちらかで行う(cf. [Babelのpresetsを設定する2つの方法](https://qiita.com/tmiki/items/86abc565d06ced78d968))
  - `webpack.config.js`に書く場合は`options`で指定する
  - `.babelrc` (not `babel.config.js`)に書く(こちらの方が複数の対象について1つで済むため良さそう)
- `webpack.config.js`をトランスパイルしたい場合は、`$ npm install --save-dev @babel/register`して、`webpack.config.js`を`webpack.config.babel.js`に変える



## React + Redux

- `$ npm --save install react react-dom redux react-redux`
- [React+Redux入門](https://qiita.com/erukiti/items/e16aa13ad81d5938374e)
- [Example: Todo List](https://redux.js.org/basics/example)
- Redux で非同期処理がしたい場合は Redux Middleware を使う(cf. https://numb86-tech.hatenablog.com/entry/2018/04/17/203802)

