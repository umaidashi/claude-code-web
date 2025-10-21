# claude-code-web

Hono を使った API サーバー

## 概要

このプロジェクトは、軽量な Web フレームワーク [Hono](https://hono.dev/) を使用した API サーバーです。

## 機能

- RESTful API エンドポイント
- CORS サポート
- ロギング機能
- ユーザー管理 API (CRUD 操作)

## セットアップ

### 必要要件

- Node.js 18 以上

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

サーバーは `http://localhost:3000` で起動します。

### ビルド

```bash
npm run build
```

### 本番環境での起動

```bash
npm start
```

## API エンドポイント

### ルートエンドポイント

```
GET /
```

API の情報と利用可能なエンドポイント一覧を返します。

### ヘルスチェック

```
GET /api/health
```

サーバーの状態を確認します。

### ユーザー管理

#### 全ユーザー取得

```
GET /api/users
```

#### 特定のユーザー取得

```
GET /api/users/:id
```

#### ユーザー作成

```
POST /api/users
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com"
}
```

#### ユーザー更新

```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### ユーザー削除

```
DELETE /api/users/:id
```

## プロジェクト構造

```
.
├── src/
│   ├── index.ts          # メインエントリーポイント
│   └── routes/
│       └── api.ts        # API ルート定義
├── package.json
├── tsconfig.json
└── README.md
```

## 技術スタック

- [Hono](https://hono.dev/) - 軽量 Web フレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な JavaScript
- [Node.js](https://nodejs.org/) - JavaScript ランタイム

## ライセンス

ISC