# claude-code-web

Hono を使った API サーバー

## 概要

このプロジェクトは、軽量な Web フレームワーク [Hono](https://hono.dev/) を使用した API サーバーです。**クリーンアーキテクチャ**と**リポジトリパターン**を採用し、データベースへの依存性を排除した設計になっています。

## 特徴

### アーキテクチャ
- **クリーンアーキテクチャ**: ドメイン層とインフラ層を分離
- **リポジトリパターン**: データベース実装の抽象化
- **マルチデータベース対応**: PostgreSQL と Turso DB の両方をサポート
- **環境変数による切り替え**: コード変更なしでデータベースを切り替え可能

### 機能
- RESTful API エンドポイント
- PostgreSQL / Turso DB データベース統合
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

### データベースの選択

このプロジェクトは **PostgreSQL** と **Turso DB** の両方をサポートしています。
`.env` ファイルの `DATABASE_TYPE` で使用するデータベースを選択できます。

#### オプション1: Turso DB（SQLite ベース）を使用

Turso DB はローカルファイルとして動作する軽量なデータベースです：

```bash
# データベースを初期化
npx tsx scripts/init-turso.ts

# .env ファイルで DATABASE_TYPE を設定
DATABASE_TYPE=turso
TURSO_DATABASE_URL=file:local.db
```

#### オプション2: PostgreSQL を使用

##### 方法A: Docker Compose

```bash
docker-compose up -d
```

##### 方法B: 直接インストール

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# PostgreSQL サービスを起動
sudo service postgresql start

# データベースとスキーマを作成
sudo -u postgres psql -c "CREATE DATABASE hono_api;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
sudo -u postgres psql -d hono_api -f init.sql

# .env ファイルで DATABASE_TYPE を設定
DATABASE_TYPE=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=hono_api
```

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
│   ├── domain/                    # ドメイン層（ビジネスロジック）
│   │   ├── entities/
│   │   │   └── user.ts            # User エンティティ
│   │   └── repositories/
│   │       └── user-repository.ts # Repository インターフェース
│   ├── infrastructure/            # インフラ層（外部依存）
│   │   ├── db/
│   │   │   ├── postgres/
│   │   │   │   ├── connection.ts       # PostgreSQL 接続
│   │   │   │   └── user-repository.ts  # PostgreSQL 実装
│   │   │   └── turso/
│   │   │       ├── connection.ts       # Turso 接続
│   │   │       ├── user-repository.ts  # Turso 実装
│   │   │       └── init.sql            # Turso 初期化SQL
│   │   └── repository-factory.ts  # Repository ファクトリー
│   ├── routes/
│   │   └── api.ts                 # API ルート定義
│   └── index.ts                   # メインエントリーポイント
├── scripts/
│   └── init-turso.ts              # Turso DB 初期化スクリプト
├── docker-compose.yml             # Docker Compose 設定
├── init.sql                       # PostgreSQL 初期化SQL
├── package.json
├── tsconfig.json
├── .env.example                   # 環境変数のサンプル
└── README.md
```

### アーキテクチャ説明

このプロジェクトは**リポジトリパターン**と**クリーンアーキテクチャ**を採用しています：

1. **ドメイン層** (`src/domain/`)
   - エンティティとリポジトリインターフェースを定義
   - データベースの実装詳細に依存しない

2. **インフラ層** (`src/infrastructure/`)
   - 具体的なデータベース実装を提供
   - PostgreSQL と Turso DB の両方を実装
   - ファクトリーパターンで実装を切り替え

3. **API層** (`src/routes/`)
   - リポジトリインターフェースのみに依存
   - データベースの実装を意識せずにビジネスロジックを記述

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

### フレームワーク
- [Hono](https://hono.dev/) - 軽量 Web フレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な JavaScript
- [Node.js](https://nodejs.org/) - JavaScript ランタイム

### データベース
- [PostgreSQL](https://www.postgresql.org/) - リレーショナルデータベース
- [Turso](https://turso.tech/) / [LibSQL](https://github.com/tursodatabase/libsql) - SQLite ベースのエッジデータベース

### データベースクライアント
- [node-postgres (pg)](https://node-postgres.com/) - PostgreSQL クライアント
- [@libsql/client](https://github.com/tursodatabase/libsql-client-ts) - Turso/LibSQL クライアント

### その他
- [Docker](https://www.docker.com/) - コンテナ化プラットフォーム
- Repository Pattern - データアクセスの抽象化
- Clean Architecture - ドメイン駆動設計

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