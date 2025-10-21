# claude-code-web

Hono を使った API サーバー

## 概要

このプロジェクトは、軽量な Web フレームワーク [Hono](https://hono.dev/) を使用した API サーバーです。PostgreSQL データベースと統合されており、永続的なデータ管理が可能です。

## 機能

- RESTful API エンドポイント
- PostgreSQL データベース統合
- CORS サポート
- ロギング機能
- ユーザー管理 API (CRUD 操作)
- Docker Compose による簡単なセットアップ

## セットアップ

### 必要要件

- Node.js 18 以上
- Docker および Docker Compose（データベース用）

### インストール

```bash
npm install
```

### データベースの起動

Docker Compose を使用して PostgreSQL データベースを起動します：

```bash
docker-compose up -d
```

データベースが起動したら、自動的にスキーマとサンプルデータが初期化されます。

### 環境変数の設定

`.env.example` をコピーして `.env` を作成します：

```bash
cp .env.example .env
```

必要に応じて環境変数を編集してください。

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

サーバーとデータベースの接続状態を確認します。

レスポンス例：
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T07:00:00.000Z",
  "database": "connected",
  "db_time": "2025-10-21T07:00:00.000Z"
}
```

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
│   ├── db/
│   │   └── connection.ts # PostgreSQL 接続設定
│   └── routes/
│       └── api.ts        # API ルート定義
├── docker-compose.yml    # Docker Compose 設定
├── init.sql              # データベース初期化スクリプト
├── package.json
├── tsconfig.json
├── .env.example          # 環境変数のサンプル
└── README.md
```

## データベーススキーマ

### users テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | SERIAL | 主キー |
| name | VARCHAR(255) | ユーザー名 |
| email | VARCHAR(255) | メールアドレス（ユニーク） |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

## 技術スタック

- [Hono](https://hono.dev/) - 軽量 Web フレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な JavaScript
- [Node.js](https://nodejs.org/) - JavaScript ランタイム
- [PostgreSQL](https://www.postgresql.org/) - リレーショナルデータベース
- [Docker](https://www.docker.com/) - コンテナ化プラットフォーム
- [node-postgres (pg)](https://node-postgres.com/) - PostgreSQL クライアント

## Docker コマンド

### データベースの起動
```bash
docker-compose up -d
```

### データベースの停止
```bash
docker-compose down
```

### データベースのログ確認
```bash
docker-compose logs -f postgres
```

### データベースに直接接続
```bash
docker-compose exec postgres psql -U postgres -d hono_api
```

## ライセンス

ISC