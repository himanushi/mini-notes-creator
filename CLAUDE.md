# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Mini Notes Creatorは、日本語対応のA6サイズメモ帳作成Webアプリケーションです。TypeScript + React + Viteで構築され、以下の特徴を持ちます：

- **基本機能**: 無地、方眼、横罫線の3種類のページタイプ
- **印刷対応**: A4用紙にA6メモ帳を印刷するためのレイアウト設計
- **高度な機能**: カレンダー表示、美文字練習（KanjiVG連携）、画像挿入、両面印刷調整

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # TypeScriptコンパイル + Vite本番ビルド
npm run preview  # ビルド結果のプレビュー
```

## アーキテクチャ

### 状態管理
アプリケーション全体の設定は`App.tsx`の`NotebookConfig`型で管理されています。この設定オブジェクトには以下が含まれます：

- **ページ設定**: タイプ（blank/grid/ruled）、ページ数、番号表示など
- **デザイン設定**: 方眼サイズ・色、罫線間隔・色
- **高度な機能**: カレンダー設定、美文字練習、画像配置
- **印刷調整**: 両面印刷時のオフセット値

### コンポーネント構造
```
App.tsx (メイン)
├── NotebookSettings.tsx (設定パネル)
└── PagePreview.tsx (プレビュー表示)
```

### 型定義
`src/types/index.ts`に全ての重要な型が集約されています：
- `NotebookConfig`: アプリケーション全体の設定
- `PageType`: ページタイプの列挙型
- `ImageConfig`: 画像挿入の設定
- `PageContent`: ページコンテンツの型定義

### PDF生成
- 依存ライブラリ: `jspdf`, `html2canvas`
- PDF出力機能は`handleExportPDF`で準備済み（実装待ち）

### スタイリング
- `src/App.css`: メインレイアウト（2パネル構成）
- `src/index.css`: 全体的なベーススタイル
- レスポンシブ対応（モバイルでは縦並び）

## 重要な実装メモ

### 日本語対応
- **必ず日本語で回答、記述すること**
- UI文言、コメント、変数名は日本語を使用
- メモ要求があればCLAUDE.mdに追記

### 単位変換
mmからpxへの変換: `const mmToPx = (mm: number) => mm * 3.7795275591`

### ページプレビュー
A6サイズ（105mm × 148mm）= 396px × 559px でプレビュー表示

### 未実装の高度な機能
- PDF生成・ダウンロード機能の実装
- 年間/月間/週間カレンダー機能
- KanjiVG連携による美文字練習機能
- 画像挿入・アップロード機能
- テスト印刷・オフセット調整機能

## メモ

2025-09-01: プロジェクト初期化完了。基本的なUI、設定パネル、プレビュー機能が動作中。開発サーバーは http://localhost:5173/ で稼働。