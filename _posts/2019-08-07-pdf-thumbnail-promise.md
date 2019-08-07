---
layout: post
title: Node.js で PDF からサムネイルを生成
---

* Goal: PDF のファイル名を受け取って、その1ページ目を PNG に変換した画像を生成する
* 一連の流れは [Promise](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Using_promises) を使って非同期処理として定義する



まず、PDF (の1ページ目)から PNG を生成するためには、[pdfjs-dist-for-node](https://www.npmjs.com/package/pdfjs-dist-for-node) を使う。このパッケージを選んだ理由と PNG にした理由は以下の通り。

- pdfjs や pdfjs-dist だとなぜか`Failed to load resource: net::ERR_FILE_NOT_FOUND`が(`getDocument()`内で？)出てダメだった
- SVG も表示できるが、背景の設定が別に必要なのと、一般に PDF から SVG への変換が安定しないことから却下



あとは、ファイル名を受け取ってから、1ページ目を切り取る、PNG に変換する、という処理を Promise で直列的に接続する。[Promiseを複数組み合わせる時の基本パターン（直列、並列、分岐）](https://qiita.com/norami_dream/items/0edfca15c15199921a73)を参考にした。

```js
const pdf = require('pdfjs-dist-for-node')

const generateThumbnail = (fileName) => {
  const prefix = fileName.match(/(.*)(?:\.([^.]+$))/)[1]

  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')

  pdf.getDocument(fileName).then(function (doc) {
    doc.getPage(1).then(function (page) {
      let viewport = page.getViewport(1.0)
      canvas.height = viewport.height
      canvas.width = viewport.width
      let renderer = {
        canvasContext: ctx,
        viewport: viewport
      }
      page.render(renderer).then(function () {
        ctx.globalCompositeOperation = 'destination-over'
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        let image = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '')
        fs.writeFile(prefix + '.png', image, 'base64', function(err) {
          if (err) {
            console.log("[ERROR] Failed to write png.")
          }
        })
      })
    })
  })
}
```

