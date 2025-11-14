# Teleop App - Windows Desktop Application

Windows上で動作するマルチ画面ビューア＋テロップ付きお知らせ掲示板アプリケーション

## 概要

このアプリケーションは、画面最上部にテロップバーを表示し、複数のメッセージを右から左にスクロール表示するWindows向けデスクトップアプリです。メッセージの管理、スケジュール設定、表示ログの記録など、豊富な機能を備えています。

## 主な機能

### 1. テロップバー
- 画面最上部に常に表示される透過ウィンドウ
- 右から左へのスムーズなスクロールアニメーション
- スケジュールに基づく自動メッセージフィルタリング
- ON/OFF、一時停止/再開のコントロール

### 2. メッセージ管理
- メッセージの追加・編集・削除
- ドラッグ＆ドロップまたは↑↓ボタンでの並び替え
- スケジュール設定（毎日/平日/週末/カスタム）
- 時間帯指定、曜日指定

### 3. カスタマイズ設定
- **フォント**: 種類、サイズ、太さ
- **色**: 文字色、背景色、透明度
- **アニメーション**: スクロール速度、メッセージ間隔
- **表示**: 高さ、常に最前面表示

### 4. ログ機能
- **表示ログ**: いつ何が表示されたかの記録
- **変更ログ**: 設定変更の履歴
- CSV形式でのエクスポート

### 5. エクスポート/インポート
- JSON形式での設定保存・読み込み
- メッセージ、スケジュール、設定の一括管理

### 6. コンテンツ表示
- 動画、PDF、Googleスプレッドシートの表示用ウィンドウ
- 複数ウィンドウの同時管理

### 7. キーボードショートカット
- `Ctrl+Shift+T`: テロップ ON/OFF
- `Ctrl+Shift+M`: メッセージエディタを開く
- `Ctrl+Shift+S`: 設定を開く
- `Ctrl+Shift+L`: ログビューアを開く

## 技術スタック

- **フレームワーク**: Electron
- **言語**: TypeScript
- **UI**: React
- **ビルドツール**: Vite
- **状態管理**: Zustand (予定)
- **ルーティング**: React Router
- **設定保存**: electron-store
- **パッケージング**: electron-builder

## セットアップ

### 必要な環境
- Node.js 18.x 以上
- npm 9.x 以上
- Windows 10/11

### インストール

```bash
# 依存関係のインストール
npm install

# 開発モードで起動
npm run dev

# ビルド
npm run build

# Windowsインストーラーの作成
npm run package:win
```

## 開発コマンド

```bash
# 開発モード（Vite + Electron）
npm run dev

# Viteのみ起動
npm run dev:vite

# Electronのみ起動
npm run dev:electron

# メインプロセスのビルド
npm run build:main

# レンダラープロセスのビルド
npm run build:renderer

# 完全ビルド
npm run build

# Windowsパッケージング
npm run package:win
```

## プロジェクト構造

```
teleop-app/
├── src/
│   ├── main/              # メインプロセス（Electron）
│   │   ├── index.ts       # エントリーポイント
│   │   ├── storage.ts     # electron-store設定
│   │   ├── ipc/           # IPC通信ハンドラー
│   │   └── windows/       # ウィンドウ管理
│   ├── renderer/          # レンダラープロセス（React）
│   │   ├── App.tsx        # ルートコンポーネント
│   │   ├── windows/       # 各ウィンドウのコンポーネント
│   │   └── services/      # ビジネスロジック
│   ├── preload/           # プリロードスクリプト
│   │   └── index.ts       # contextBridge設定
│   └── shared/            # 共有型定義
│       └── models/        # データモデル
├── dist/                  # ビルド出力
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── electron-builder.json
```

## アーキテクチャ

### 3層アーキテクチャ
1. **データ層**: データソースの抽象化（将来の外部API連携に対応）
2. **サービス層**: ビジネスロジック（MessageService, ScheduleService, LogService）
3. **表示層**: React コンポーネント

### IPC通信
- メインプロセスとレンダラープロセス間の通信
- contextBridge による安全な API 公開
- 型安全な通信インターフェース

## 将来の拡張予定

- Google スプレッドシートからのメッセージ取得
- Dify / GAS / 社内APIとの連携
- レイアウトプリセット機能
- マルチディスプレイ対応
- クラウド同期機能

## ライセンス

MIT

## 開発者

Developed by Devin AI
Requested by: hayato.takino0855@gmail.com (@hayatotakino0855-del)

## リンク

- [Devin Session](https://app.devin.ai/sessions/786479c62e8247ecacd1204cfb98e6a9)
- [GitHub Repository](https://github.com/hayatotakino0855-del/-)
