# slack-listner

設定したチームのプライベートチャネルの更新状況を表示するシンプルなアプリケーションです。

kegamin さんの作成された [electron_test](https://github.com/kegamin/electron_test.git) をベースにしました。

## 機能

* 設定したチームのプライベートチャネルの更新状況を表示します
* プライベートチャネルは更新時刻でソートされます
* 該当チャネルを公式 Slack アプリで開くことができます (macOS のみで確認)

## 基本設定

`app/assets/conf.json` にて、テスト用 API トークンを指定する必要があります。

```json
{
  "tokens": {
    "team-1-name": "your-token-for-team-1",
    "team-2-name": "your-token-for-team-2"
  },
  "ignore": ["class", "coffee-break"]
}
```

[Tokens for Testing and Development - Slack API](https://api.slack.com/docs/oauth-test-tokens) から API トークンを取得してください。


## アプリのビルド

### セットアップ

```bash
cd repository_dir
clone https://github.com/takkyun/slack-listener.git slack-listener
cd slack-listener
npm install
```

### アプリ起動（デバッグ）

```bash
npm start
```

### バイナリーのビルド

```bash
npm run build
```

* 上記コマンドでは macOS 用アプリのみ作成します。

## コピーライト

[slack-listener](https://github.com/takkyun/slack-listener.gitC) は Takuya Otani / SimpleBoxes によって開発されました。

Copyright (c) 2017 Takuya Otani / [SerendipityNZ](http://serendipitynz.com/) Ltd.

## ライセンス

slack-listener is released under the MIT-license.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
