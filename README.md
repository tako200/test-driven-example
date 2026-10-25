# TDD ハンズオン環境

FastAPI（Python 3.13）と Vue.js 3（TypeScript）でテスト駆動開発を練習するための環境です。Docker 上で動作します。

## 必要なもの

- Docker Desktop（Docker Compose v2 以上）
- make

## セットアップ

```bash
make build       # 初回のみ（依存を変更したときも実行）
make test        # backend のテストが 1 件通れば OK
make front-test  # frontend のテストが 1 件通れば OK
```

## コマンド一覧

### 共通

| コマンド | 内容 |
| --- | --- |
| `make build` | イメージをビルド |
| `make up` | 開発サーバーを起動（backend: http://localhost:8000/docs 、frontend: http://localhost:5173 ） |
| `make down` | 開発サーバーを停止 |
| `make logs` | サーバーログを表示 |

### backend

| コマンド | 内容 |
| --- | --- |
| `make test` | テストを実行 |
| `make watch` | ファイル保存のたびにテストを自動実行（TDD 中はこれを開いておく） |
| `make cov` | カバレッジ付きでテストを実行 |
| `make lint` | ruff で lint とフォーマットをチェック |
| `make format` | ruff で自動整形 |
| `make shell` | コンテナ内でシェルを起動 |

### frontend

| コマンド | 内容 |
| --- | --- |
| `make front-test` | テストを実行 |
| `make front-watch` | ファイル保存のたびにテストを自動実行（TDD 中はこれを開いておく） |
| `make front-lint` | ESLint と Prettier でチェック |
| `make front-format` | 自動整形 |
| `make front-type-check` | 型チェック |
| `make front-shell` | コンテナ内でシェルを起動 |

`backend/` と `frontend/` はコンテナにマウントされているため、ホストで編集した内容はそのまま反映されます。
frontend から `/api/...` にリクエストすると、backend に転送されます（例: `/api/health` → backend の `/health`）。

## ディレクトリ構成

```
backend/
├── app/
│   ├── main.py          # FastAPI アプリ
│   ├── api/             # エンドポイント
│   ├── domain/          # ビジネスロジック（FastAPI に依存しない）
│   └── repositories/    # インメモリのデータ保持（DB の代わり）
└── tests/
    ├── conftest.py      # 共通 fixture（client など）
    ├── unit/            # domain の単体テスト
    └── api/             # エンドポイントのテスト

frontend/
├── src/
│   ├── main.ts
│   ├── App.vue
│   └── components/      # コンポーネント
└── tests/               # コンポーネントのテスト（*.spec.ts）
```
