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
