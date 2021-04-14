# GraphCMSで学ぶGraphQL-8回目

GraphCMSで学ぶGraphQL-8回目のサンプルコードです。

## デモ

各デモのURLは、以下のようになっています。

- https://codegrid.github.io/2020-graphql/8/
  - 本シリーズで実装していくUIの完成品です
- https://codegrid.github.io/2020-graphql/8/01.html
  - 記事一覧UIを実装した時点でのデモです
- https://codegrid.github.io/2020-graphql/8/02.html
  - 記事詳細UIを実装した時点でのデモです
- https://codegrid.github.io/2020-graphql/8/03.html
  - 記事詳細UIの画像サイズを調整した時点でのデモです

## サンプルコードの構成

本サンプルコードは次のような構成になっています。

```text
src/
 |- 01/  // 記事一覧UIを実装した時点でのコード
 |- 02/  // 記事詳細UIを実装した時点でのコード
 |- 03/  // 記事詳細UIの画像サイズを調整した時点でのコード
 |- main.js  // GraphCMSからデータを取得してDOMへ反映する
 |- renderer.js  // 与えられたデータを元にDOMを構築する
 |- request.js  // GraphQLクエリを受け取りGraphCMSへリクエストする
 |- style.css
```
