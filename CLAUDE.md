# Project Design Specification

This file is the single source of truth for this project. All code must conform to this specification.

## Constitution (Project Rules)
# Wakaroute プロジェクト憲法

**文書バージョン**: 1.0.0  
**最終更新**: 2025年  
**適用範囲**: Wakaroute（ワカル・ルート）全開発工程

---

## 第1章 プロジェクト理念・ミッション

### 1.1 コアミッション

> **「わからない」を恥にしない。戻ることを前進に変える。**

すべての設計・実装・UX判断は、この一文を基準に行う。  
子どもが「わからない」と感じた瞬間を、恐れや挫折ではなく「冒険のスタート地点」として体験できることを最優先とする。

### 1.2 設計哲学

| 原則 | 説明 |
|------|------|
| **ポジティブ・ファースト** | エラーメッセージ・不正解フィードバックは一切ネガティブな表現を使用しない |
| **スモールステップ絶対主義** | ユーザーが圧倒されないよう、一画面に表示する情報量を最小化する |
| **保護者は「観察者」** | 保護者UIは子どもの「失敗」ではなく「発見」を伝える設計にする |
| **AI補助・人間主体** | AIは提案するだけ。最終判断は常に学習者本人が行う |
| **プライバシー・バイ・デザイン** | 子どものデータ収集は最小限。児童向けプライバシー法を最優先遵守 |

---

## 第2章 技術的制約・非交渉ルール

### 2.1 技術スタック（変更禁止）

```
フロントエンド : Next.js 15 (App Router) + React 19
スタイリング   : Tailwind CSS v4 + shadcn/ui
状態管理       : Zustand + TanStack Query v5
認証           : NextAuth.js v5 (Auth.js)
DB             : PostgreSQL (Supabase)
ORM            : Prisma v6
AI             : Google Gemini 2.0 Flash (Vision対応)
ストレージ     : Supabase Storage
メール         : Resend
決済           : Stripe
i18n           : next-intl v3
デプロイ       : Vercel (Edge Functions活用)
```

### 2.2 コーディング規約（強制）

- **TypeScript strict mode** を必ず有効化。`any` 型の使用は原則禁止（外部API型定義のみ例外）
- **ESLint + Prettier** の設定を全員共通で使用。CIで自動チェック
- **コンポーネント命名**: PascalCase。ファイル名はコンポーネント名と一致させる
- **関数命名**: camelCase。イベントハンドラは `handle` プレフィックス
- **コメント**: 複雑なロジックには必ず日本語コメントを付記
- **マジックナンバー禁止**: 定数はすべて `constants/` に切り出す

### 2.3 アーキテクチャ境界（違反禁止）

```
❌ 禁止事項
- Clientコンポーネントでの直接DB接続
- APIルートでのビジネスロジック記述（Service層に委譲）
- AI APIキーのクライアントサイド露出
- 子どものPII（個人識別情報）のクライアントサイドログ出力
- 外部ライブラリの無審査追加（アーキテクト承認必須）

✅ 必須事項
- すべてのServer Actionsは入力バリデーション（Zod）を実施
- DB操作はすべてPrismaを経由
- AIリクエストはServer-side専用エンドポイント経由
- 環境変数はすべてサーバーサイドのみ（NEXT_PUBLIC_は最小限）
```

---

## 第3章 セキュリティ要件

### 3.1 児童プライバシー保護（最優先）

```
準拠法令:
- COPPA (Children's Online Privacy Protection Act) - 米国
- GDPR Article 8 (子どものデータ) - EU
- 個人情報保護法（改正版）- 日本
- PIPEDA - カナダ
- PDPA - タイ/シンガポール
```

**具体的実装要件**:
- 13歳未満ユーザーの登録には保護者メール確認を必須とする
- 子どもアカウントは保護者アカウントに紐づける（孤立禁止）
- 子どもの学習データは保護者が即時削除可能にする
- サードパーティ広告トラッキングは子どもアカウントに対して完全無効化
- カメラ撮影画像はAI処理後にサーバーに保存しない（処理完了後即時削除）

### 3.2 認証・認可

- パスワードは bcrypt（コスト係数12以上）でハッシュ化
- JWTトークンの有効期限: アクセストークン15分、リフレッシュトークン7日
- Rate Limiting: AI APIエンドポイントは1ユーザー/分10リクエスト上限
- CSRF保護: Next.js Server Actionsのデフォルト保護 + 追加ヘッダー検証
- SQLインジェクション: Prismaのプリペアドステートメントで完全防御
- XSS: dangerouslySetInnerHTMLの使用禁止（DOMPurify使用時のみ例外）

### 3.3 API セキュリティ

```typescript
// すべてのAPIルートに必須のセキュリティヘッダー
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), microphone=()',
  'Content-Security-Policy': '...' // 詳細はnext.config.tsで定義
}
```

---

## 第4章 品質基準

### 4.1 パフォーマンス指標（Core Web Vitals）

| 指標 | 目標値 | 計測ツール |
|------|--------|-----------|
| LCP (Largest Contentful Paint) | < 2.5秒 | Vercel Analytics |
| FID (First Input Delay) | < 100ms | Vercel Analytics |
| CLS (Cumulative Layout Shift) | < 0.1 | Vercel Analytics |
| TTFB (Time to First Byte) | < 800ms | Lighthouse |
| バンドルサイズ（初期） | < 200KB (gzip) | Bundle Analyzer |

### 4.2 アクセシビリティ（WCAG 2.1 AA準拠）

- すべてのインタラクティブ要素にキーボード操作対応
- スクリーンリーダー対応（ARIA ラベル必須）
- 色コントラスト比 4.5:1 以上
- フォントサイズ最小14px（子ども向けUIは16px以上）
- アニメーションは `prefers-reduced-motion` を尊重

### 4.3 テストカバレッジ要件

```
単体テスト (Vitest)    : カバレッジ 80% 以上
統合テスト (Playwright): 主要ユーザーフロー100%カバー
E2Eテスト             : 認証・決済・AI分解フローを必須カバー
```

### 4.4 多言語品質基準

- 機械翻訳のみでのリリース禁止（ネイティブレビュー必須）
- RTL（右から左）レイアウト: アラビア語で全画面テスト必須
- 翻訳キーの欠落はCIでエラー扱い（フォールバック言語への自動切替あり）
- 数字・日付・通貨はロケール対応フォーマット（Intl API使用）

---

## 第5章 収益・ビジネス規約

### 5.1 Freemium境界の明確化

```
Free プラン:
- AI分解: 月5回まで
- 逆のぼり診断: 無制限
- 言語: 日・英のみ
- 保護者連携: なし

Premium プラン（個人）:
- AI分解: 無制限
- 全言語対応
- 保護者連携フル機能
- 学習レポートPDF出力

Family プラン:
- Premium機能 + 子ども5人まで
- 兄弟間の進捗比較なし（競争煽り禁止）

School プラン（法人）:
- クラス単位管理
- LMS連携API
- カスタムブランディング
```

### 5.2 課金倫理規定

- ダークパターン（隠れた自動更新等）の使用禁止
- 子ども向けUIに課金誘導ボタンを表示禁止
- 解約はワンクリックで完了できること
- トライアル終了前72時間前に必ずメール通知

---

## 第6章 AI利用規約

### 6.1 Gemini API使用制限

- プロンプトに子どもの氏名・住所等のPIIを含めることを禁止
- AIの回答は必ず「提案」として提示（断定表現禁止）
- AI生成コンテンツには視覚的マーカー（🤖アイコン等）を付与
- 有害コンテンツフィルタリングは必ず有効化
- AI応答のログは30日後に自動削除

### 6.2 コンテンツ安全性

```
必須フィルタリング項目:
- 暴力・恐怖表現
- 年齢不適切な内容
- 個人攻撃・差別表現
- 宗教・政治的偏向コンテンツ
```

---

## 第7章 変更管理

### 7.1 憲法改定プロセス

- 本憲法の改定にはリードアーキテクト + プロダクトオーナーの承認が必要
- セキュリティ関連条項の変更は、セキュリティチームのレビューを必須とする
- 技術スタックの変更は、アーキテクトチームの全会一致を必須とする

---

## Design Specification
N/A

## Development Instructions
N/A

## Technical Stack
- Next.js 15 + React 19 + TypeScript (strict mode)
- TailwindCSS 4
- Vitest for unit tests
- Playwright for E2E tests

## Code Standards
- TypeScript strict mode, no `any`
- Minimal comments — code should be self-documenting
- Use path alias `@/` for imports from `src/`
- All components use functional style with proper typing

## Internationalization (i18n)
- Supported languages: ja (日本語), en (English), zh (中文), ko (한국어), es (Español), fr (Français), de (Deutsch), pt (Português), ar (العربية), hi (हिन्दी)
- Use the i18n module at `@/i18n` for all user-facing strings
- Use `t("key")` function for translations — never hardcode UI strings
- Auto-detect device language via expo-localization
- Default language: ja (Japanese)
- RTL support required for Arabic (ar)
- Use isRTL flag from i18n module for layout adjustments

---

## Feature: AI分解機能のUIと国際化 (1)

### 概要
ユーザーがテキストまたは画像をアップロードし、AIによる学習ステップ分解のフィードバックを受け取るためのUIを実装する。国際化対応を必須とする。

### 構成要素
1.  **`app/(main)/decompose/page.tsx`**: AI分解機能のメインページ。
    *   クライアントコンポーネント。
    *   `InputArea` と `AiFeedback` コンポーネントを配置。
    *   `next-intl` の `useTranslations` を使用して国際化対応。
    *   ローディング状態とフィードバックメッセージを管理。
    *   URLがロケールプレフィックスされていない場合、リダイレクト処理を行う。
2.  **`components/decompose/input-area.tsx`**: ユーザー入力エリア。
    *   テキスト入力 (`textarea`) と画像アップロード (`input type="file"`) を提供。
    *   `onDecompose` プロップを通じて親コンポーネントにデータ（テキスト、画像ファイル）を渡す。
    *   ローディング状態に応じて入力フィールドとボタンを無効化。
    *   画像選択/クリア機能。
    *   **スタイリング**: Tailwind CSS v4 を使用し、基本的なフォーム要素（Input, Textarea, Button, Label）を実装。shadcn/uiのコンポーネントはまだ統合されていないため、プレースホルダーとして基本的なHTML要素にTailwindクラスを適用する。
    *   **国際化**: `useTranslations` を使用して、プレースホルダーテキストやボタンのラベルを翻訳。
3.  **`components/decompose/ai-feedback.tsx`**: AIからのフィードバック表示エリア。
    *   `message` (表示するテキスト) と `type` ("success", "error", "info") をプロップとして受け取る。
    *   `type` に応じて背景色、テキスト色、アイコンを変更。
    *   **「ポジティブ・ファースト」原則の遵守**: `type="error"` の場合でも、ネガティブな表現やアイコン（例: 赤色のXマーク）は使用せず、代わりに「ヒント」や「提案」を示すようなアイコン（例: 💡）と色（例: 黄色）を使用する。
    *   **スタイリング**: Tailwind CSS v4 を使用。
    *   **国際化**: `useTranslations` を使用して、将来的にフィードバックメッセージ自体も翻訳可能にする。

### 国際化 (i18n) 要件
*   `next-intl` v3 を使用。
*   `app/[locale]/layout.tsx` で `NextIntlClientProvider` を設定。
*   `app/[locale]/page.tsx` および認証関連ページ (`app/[locale]/(auth)/login/page.tsx`, `app/[locale]/(auth)/signup/page.tsx`) もロケールプレフィックスされたパスに移動し、`useTranslations` を使用して国際化対応。
*   `app/_layout.tsx` は削除し、`app/[locale]/layout.tsx` がルートレイアウトとして機能するようにする。
*   `app/index.tsx` は `app/[locale]/page.tsx` に統合されるため削除。
*   `components/i18n-provider.tsx` および `i18n/translations.ts` は `next-intl` の標準的な使い方に合わないため削除。
*   `app.json` の `locales` 設定は、`next-intl` のサーバーサイドメッセージロードと競合するため削除。`next-intl` はファイルシステムからメッセージをロードする。
*   `expo-localization` はNext.js環境では使用しない。ブラウザの `navigator.language` または `next-intl` のミドルウェアでロケールを検出する。

### 技術的詳細
*   **Next.js 15 (App Router)**: すべてのページとコンポーネントはApp Routerの規約に従う。
*   **TypeScript strict mode**: すべてのファイルで型安全性を確保。
*   **Tailwind CSS v4**: スタイリングに使用。
*   **Server Actions**: `app/actions/auth.ts` で `signupAction` を実装し、Zodによる入力バリデーションとbcryptによるパスワードハッシュ化を行う。
*   **NextAuth.js v5**: 認証システムを構築。`lib/auth.ts` で `authConfig` を定義し、Credentialsプロバイダーを使用。PrismaAdapterを統合。
*   **Prisma v6**: データベース操作に使用。`lib/db.ts` でPrismaClientのシングルトンインスタンスを管理。

### 変更点サマリー
1.  **ファイル構造の変更**:
    *   `app/(auth)/login/page.tsx` -> `app/[locale]/(auth)/login/page.tsx`
    *   `app/(auth)/signup/page.tsx` -> `app/[locale]/(auth)/signup/page.tsx`
    *   `app/(main)/decompose/page.tsx` -> `app/[locale]/(main)/decompose/page.tsx` (新規作成)
    *   `app/index.tsx` -> 削除 (代わりに `app/[locale]/page.tsx` を使用)
    *   `app/_layout.tsx` -> 削除 (代わりに `app/[locale]/layout.tsx` を使用)
    *   `components/i18n-provider.tsx` -> 削除
    *   `i18n/translations.ts` -> 削除
2.  **国際化ロジックの調整**:
    *   `app/[locale]/layout.tsx` がルートレイアウトとして機能し、`NextIntlClientProvider` をラップする。
    *   `next-intl/server` の `getMessages` を使用してサーバーサイドでメッセージをロード。
    *   `expo-localization` の使用を削除。ブラウザのロケール検出は `next-intl` のミドルウェアまたはブラウザAPIに依存。
    *   RTLサポート (`dir="rtl"`) を `app/[locale]/layout.tsx` の `<html>` タグに適用。
3.  **AI分解機能のUI実装**:
    *   `app/[locale]/(main)/decompose/page.tsx` に `InputArea` と `AiFeedback` を統合。
    *   `components/decompose/input-area.tsx` でテキスト入力と画像アップロードを処理。
    *   `components/decompose/ai-feedback.tsx` でAIフィードバックを表示し、「ポジティブ・ファースト」原則を遵守。
4.  **認証機能の調整**:
    *   `app/actions/auth.ts` の `signupAction` で `isParent` と `childEmail` のバリデーションロジックを強化。
    *   `lib/auth.ts` で `UserRole` 型を定義し、`NextAuth` の型拡張を行う。
    *   `login-form.tsx` と `signup-form.tsx` で `useLocale` を使用し、リダイレクトパスにロケールプレフィックスを適用。
5.  **`app.json` の削除**: Next.jsプロジェクトでは不要。

---

## 懸念事項
*   `expo-localization` はNext.js環境では動作しないため、削除が必要。ブラウザベースのロケール検出に切り替える。
*   `app.json` はExpoプロジェクトの設定ファイルであり、Next.jsプロジェクトでは不要。
*   `app/_layout.tsx` と `app/index.tsx` はNext.js App Routerの規約に合わないため、`app/[locale]/layout.tsx` と `app/[locale]/page.tsx` に統合する。
*   `components/i18n-provider.tsx` と `i18n/translations.ts` は `next-intl` の標準的な使い方と異なるため削除。
*   `lib/auth.ts` のJWTトークン有効期限に関するコメントは、NextAuth.js v5の挙動を正確に反映させる必要がある。現在の実装ではデフォルトのセッション期間に依存している。

---
---
## Review Task
Review the current codebase against CLAUDE.md design specifications.
Focus on the recently implemented feature: "AI分解機能のUIと国際化 (1)"

Check:
1. Does the implementation match the design spec in CLAUDE.md?
2. Are the correct file paths and component names used?
3. Are all required props/interfaces implemented?
4. Does the styling match the spec?
