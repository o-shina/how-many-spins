# デザイン文書

## 概要

「地球が何回回った時？」Webアプリケーションは、地球の自転回数を計算・表示するリアルタイムWebアプリです。MVPでは現在時刻での回転数表示、リアルタイムカウンター、煽りフレーズ生成、レスポンシブ対応を提供し、将来的に任意日時変換、他惑星比較、SNSシェア、ミニゲーム機能を拡張します。

## アーキテクチャ

### システム構成
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Calculation   │    │   Storage       │
│   (Next.js)     │◄──►│   Engine        │◄──►│   (LocalStorage)│
│                 │    │   (JavaScript)  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技術スタック
- **フロントエンド**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript
- **ホスティング**: GitHub Pages (静的サイト生成)
- **状態管理**: React Hooks (useState, useEffect, useCallback)

### デプロイメント戦略
- **開発環境**: `npm run dev` でローカル開発サーバー
- **本番環境**: `npm run build && npm run export` で静的ファイル生成
- **CI/CD**: GitHub Actions で自動デプロイ

## コンポーネントとインターフェース

### コンポーネント階層
```
App
├── Header
│   ├── Title
│   └── ThemeToggle (拡張要件)
├── MainCounter
│   ├── CurrentDateTime
│   ├── RotationDisplay
│   └── RealtimeCounter
├── ActionPanel
│   ├── TauntGenerator
│   └── CopyButton
├── InputSection (拡張要件)
│   ├── DateTimeInput
│   └── RotationInput
└── Footer
    └── InfoTooltip (拡張要件)
```

### 主要インターフェース

#### EarthRotationCalculator
```typescript
interface EarthRotationCalculator {
  calculateRotationsFromDate(date: Date): number;
  calculateDateFromRotations(rotations: number): Date;
  getCurrentRotations(): number;
  formatRotations(rotations: number): string;
}
```

#### TauntGenerator
```typescript
interface TauntGenerator {
  generateTaunt(date: Date, rotations: number): string;
  copyToClipboard(text: string): Promise<boolean>;
}
```

#### ThemeManager (拡張要件)
```typescript
interface ThemeManager {
  currentTheme: 'light' | 'dark';
  toggleTheme(): void;
  saveTheme(theme: string): void;
  loadTheme(): string;
}
```

## データモデル

### 地球回転データ
```typescript
interface EarthRotationData {
  currentDateTime: Date;
  rotationCount: number;
  formattedRotations: string;
  formattedDateTime: string;
  calculationBasis: 'UTC' | 'LOCAL';
}
```

### 煽りフレーズデータ
```typescript
interface TauntData {
  phrase: string;
  timestamp: Date;
  rotations: number;
  copyable: boolean;
}
```

### アプリケーション状態
```typescript
interface AppState {
  rotationData: EarthRotationData;
  tauntData: TauntData | null;
  isRealTimeActive: boolean;
  theme: 'light' | 'dark'; // 拡張要件
  lastUpdateTime: number;
}
```

## エラーハンドリング

### エラータイプ
1. **計算エラー**: 無効な日時や回転数の入力
2. **ブラウザ互換性エラー**: 古いブラウザでの機能制限
3. **クリップボードエラー**: コピー機能の失敗
4. **リアルタイム更新エラー**: タイマー機能の停止

### エラー処理戦略
```typescript
interface ErrorHandler {
  handleCalculationError(error: Error): void;
  handleClipboardError(error: Error): void;
  handleTimerError(error: Error): void;
  showUserFriendlyMessage(message: string): void;
}
```

### フォールバック機能
- 計算エラー時: デフォルト値（現在時刻）を使用
- クリップボードエラー時: テキスト選択状態にして手動コピーを促す
- タイマーエラー時: 手動更新ボタンを表示

## テスト戦略

### 単体テスト
- **計算ロジック**: 地球回転数の計算精度テスト
- **日時変換**: 各種日時フォーマットの変換テスト
- **フレーズ生成**: 煽りフレーズの正確性テスト

### 統合テスト
- **リアルタイム更新**: カウンターの連続動作テスト
- **ユーザーインタラクション**: ボタンクリックとコピー機能テスト
- **レスポンシブ**: 各デバイスサイズでの表示テスト

### E2Eテスト
- **基本フロー**: ページ読み込み → 回転数表示 → フレーズ生成 → コピー
- **リアルタイム**: 1分間の連続カウンター動作確認
- **クロスブラウザ**: Chrome, Firefox, Safari, Edge での動作確認

### テストツール
- **単体テスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright
- **パフォーマンステスト**: Lighthouse CI

## 実装の詳細

### 地球回転計算アルゴリズム
```typescript
const SIDEREAL_DAY_MS = 86164000; // 恒星日（ミリ秒）
const EPOCH_START = new Date('0001-01-01T00:00:00.000Z');

function calculateEarthRotations(targetDate: Date): number {
  const timeDiff = targetDate.getTime() - EPOCH_START.getTime();
  return timeDiff / SIDEREAL_DAY_MS;
}
```

### リアルタイム更新システム
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    const rotations = calculateEarthRotations(now);
    setRotationData({
      currentDateTime: now,
      rotationCount: rotations,
      formattedRotations: formatRotations(rotations),
      formattedDateTime: formatDateTime(now)
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

### レスポンシブデザイン実装
```css
/* モバイルファースト設計 */
.rotation-display {
  @apply text-2xl font-mono text-center p-4;
}

/* タブレット */
@media (min-width: 768px) {
  .rotation-display {
    @apply text-4xl p-6;
  }
}

/* デスクトップ */
@media (min-width: 1024px) {
  .rotation-display {
    @apply text-6xl p-8;
  }
}
```

### パフォーマンス最適化
- **メモ化**: React.memo でコンポーネントの不要な再レンダリングを防止
- **遅延読み込み**: 拡張機能のコンポーネントを動的インポート
- **バンドル最適化**: Next.js の自動コード分割を活用
- **画像最適化**: Next.js Image コンポーネントを使用

## セキュリティ考慮事項

### クライアントサイドセキュリティ
- **XSS対策**: React の自動エスケープ機能を活用
- **入力検証**: 日時と数値入力の厳密なバリデーション
- **CSP設定**: Content Security Policy でスクリプト実行を制限

### プライバシー保護
- **データ収集**: ユーザーデータの収集は最小限に抑制
- **ローカルストレージ**: テーマ設定のみをローカルに保存
- **外部通信**: 必要最小限の外部リソース読み込み

## 将来の拡張性

### 拡張要件への対応
1. **任意日時変換**: InputSection コンポーネントの追加
2. **他惑星比較**: PlanetComparison コンポーネントの追加
3. **SNSシェア**: SharePanel コンポーネントの追加
4. **ミニゲーム**: GameSection コンポーネントの追加

### アーキテクチャの拡張
- **状態管理**: 複雑化時は Zustand や Redux Toolkit を導入
- **API統合**: 天体データ取得用の外部API連携
- **PWA対応**: Service Worker でオフライン機能を追加
- **多言語対応**: i18n ライブラリでの国際化

### スケーラビリティ
- **CDN配信**: Cloudflare での高速配信
- **キャッシュ戦略**: ブラウザキャッシュとSWキャッシュの最適化
- **モニタリング**: Sentry でのエラー追跡とパフォーマンス監視