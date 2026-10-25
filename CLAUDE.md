# CLAUDE.md

このリポジトリは **テスト駆動開発（TDD）のハンズオン** を行うための環境です。
Claude はこのファイルの方針に従って環境構築・コード作成を行ってください。

---

## 1. 目的

- FastAPI のバックエンドと Vue.js のフロントエンドで、Red → Green → Refactor のサイクルをすぐに回せる環境を用意する
- ロジック単体のテストと API レベルのテストの両方を書ける土台を作る
- Docker で環境を揃え、参加者の PC 環境の差異をなくす

## 2. 前提・方針

| 項目 | 方針 |
| --- | --- |
| 実行環境 | **Docker / Docker Compose**。ホストに必要なのは Docker と make のみ |
| バックエンド | Python 3.13 / FastAPI |
| フロントエンド | Vue.js 3 / TypeScript / Vite |
| DB | **使用しない**。データが必要な場合はメモリ上で保持する |
| 外部サービス | 使用しない（ネットワーク不要でテストが完結すること） |
| パッケージ管理 | バックエンド: `pip`（`requirements.txt` / `requirements-dev.txt`）。ツール設定は `pyproject.toml`<br>フロントエンド: `npm`（`package.json` / `package-lock.json`） |

## 3. 技術スタック

### バックエンド

| 用途 | ツール |
| --- | --- |
| Web フレームワーク | FastAPI |
| ASGI サーバー | uvicorn |
| テストランナー | pytest |
| API テスト | FastAPI `TestClient`（httpx） |
| カバレッジ | pytest-cov |
| 自動再実行 | pytest-watcher（`ptw`）※TDD サイクルを回しやすくするため |
| Lint / Format | ruff |

### フロントエンド

| 用途 | ツール |
| --- | --- |
| フレームワーク | Vue 3（Composition API, `<script setup>`）+ TypeScript |
| ビルド / 開発サーバー | Vite |
| スタイリング | Tailwind CSS v4（`@tailwindcss/vite`。エントリは `src/style.css`） |
| テストランナー | Vitest（jsdom 環境） |
| コンポーネントテスト | @vue/test-utils |
| 型チェック | vue-tsc |
| Lint / Format | ESLint（eslint-plugin-vue, typescript-eslint, @vitest/eslint-plugin）+ Prettier |

- TypeScript は typescript-eslint の対応範囲に合わせて 6.0 系に固定している（7 系は未対応）

## 4. Docker 構成

`compose.yaml` に `backend` と `frontend` の 2 サービスを定義する。

| サービス | ベースイメージ | 公開ポート | 開発サーバー |
| --- | --- | --- | --- |
| backend | `python:3.13-slim` | 8000 | `uvicorn --reload` |
| frontend | `node:24-slim` | 5173 | `vite` |

- 依存はビルド時にインストールする（backend: `requirements-dev.txt`、frontend: `npm ci`）
- `./backend`・`./frontend` を `/app` にバインドマウントし、ホストで編集したコードが即座にコンテナへ反映される
- frontend の `node_modules` は匿名ボリュームにしてホストと共有しない（ホストに Node.js がなくても動くように）
- frontend の `/api/*` へのリクエストは Vite のプロキシで backend に転送する（`/api` は取り除かれる。例: `/api/health` → `backend:8000/health`）
- テスト・lint などは `docker compose run --rm <サービス> <コマンド>` で実行する（Makefile でラップ）
- 依存パッケージを変更したら `make build` でイメージを再ビルドする

## 5. ディレクトリ構成

```
test-driven-example/
├── CLAUDE.md
├── README.md                 # セットアップ手順・コマンド一覧
├── Makefile                  # docker compose コマンドのショートカット
├── compose.yaml
├── .gitignore
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── requirements.txt      # 実行時の依存
│   ├── requirements-dev.txt  # テスト・開発用の依存（requirements.txt を含む）
│   ├── pyproject.toml        # pytest・ruff 設定
│   ├── app/
│   │   ├── main.py           # FastAPI アプリ生成・ルーター登録
│   │   ├── api/              # ルーター（HTTP 層）
│   │   ├── domain/           # ビジネスロジック（純粋な Python、FastAPI 非依存）
│   │   └── repositories/     # インメモリのデータ保持（DB の代わり）
│   └── tests/
│       ├── conftest.py       # 共通 fixture（TestClient など）
│       ├── unit/             # domain 層の単体テスト
│       └── api/              # エンドポイントのテスト
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json          # 依存・npm scripts
    ├── package-lock.json
    ├── vite.config.ts        # Vite・Vitest・API プロキシ設定
    ├── tsconfig.json
    ├── eslint.config.js
    ├── .prettierrc.json
    ├── index.html
    ├── src/
    │   ├── main.ts
    │   ├── App.vue
    │   └── components/       # コンポーネント（必要になったら作成）
    └── tests/                # コンポーネントのテスト（*.spec.ts）
```

初期状態では動作確認用に、backend は `GET /health` とそのテスト、frontend はタイトルを表示する `App.vue` とそのテストを 1 本ずつだけ用意する。

### レイヤーの考え方

- **domain**: ロジック本体。FastAPI に依存させず、pytest だけで高速にテストできるようにする
- **repositories**: DB の代わりのインメモリ実装。テストごとに状態をリセットできるよう、`Depends` + `app.dependency_overrides` で差し替え可能にする
- **api**: リクエスト/レスポンスの変換と domain の呼び出しのみ。薄く保つ

## 6. 主要コマンド

```bash
# 共通
make build    # イメージをビルド（初回・依存変更時）
make up       # 開発サーバーを起動（backend: http://localhost:8000/docs, frontend: http://localhost:5173）
make down     # 停止
make logs     # サーバーログを表示

# backend
make test     # pytest 実行
make watch    # ファイル変更でテスト自動再実行（TDD 用）
make cov      # カバレッジ付きテスト
make lint     # ruff check + ruff format --check
make format   # ruff format + ruff check --fix
make shell    # コンテナ内でシェルを起動

# frontend
make front-test        # vitest 実行
make front-watch       # ファイル変更でテスト自動再実行（TDD 用）
make front-lint        # eslint + prettier --check
make front-format      # prettier --write + eslint --fix
make front-type-check  # vue-tsc による型チェック
make front-shell       # コンテナ内でシェルを起動
```

## 7. Claude への作業ルール

- **TDD を守る**: 機能追加・修正時は必ず「失敗するテストを先に書く → 最小実装で通す → リファクタリング」の順で進める。テストなしで実装コードを書かない
- 1 サイクルは小さく。1 つのテストで 1 つの振る舞いを確認する
- テストは互いに独立させる（インメモリの状態は fixture でリセット）
- コマンドはコンテナ内で実行する（`make test` など）。ホストの Python に依存しない
- 依存パッケージを追加する場合は `requirements*.txt` / `package.json` に記載し、理由を説明する（バージョンは固定する）
- 作業の区切りでは `make lint` と `make test`（frontend を触った場合は `make front-lint`・`make front-type-check`・`make front-test`）が通ることを確認する
