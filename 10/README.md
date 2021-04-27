# GraphCMSで学ぶGraphQL-10回目

GraphCMSで学ぶGraphQL-10回目のサンプルコードです。

## 動作手順

リポジトリをcloneしたディレクトリ内で、`.env.example`をコピーして、自身のGraphCMSプロジェクトの認証トークンを、GRAPHCMS_TOKENに設定してください。

```sh
$ cp .env.example .env
```

```text
# .env
GRAPHCMS_TOKEN={GraphCMSの認証トークン}
```

その後、以下のコマンドを実行すると、 http://localhost:8080/ にサーバーが立ち上がるので、URLをブラウザで開いてご確認ください。

```sh
$ npm install
$ npm start
```
