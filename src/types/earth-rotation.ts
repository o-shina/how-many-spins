/**
 * 地球回転データの型定義
 */
export interface EarthRotationData {
  /** 現在の日時 */
  currentDateTime: Date;
  /** 回転数 */
  rotationCount: number;
  /** フォーマット済み回転数文字列 */
  formattedRotations: string;
  /** フォーマット済み日時文字列 */
  formattedDateTime: string;
  /** 計算基準 */
  calculationBasis: 'UTC' | 'LOCAL';
}

/**
 * 煽りフレーズデータの型定義
 */
export interface TauntData {
  /** フレーズ文字列 */
  phrase: string;
  /** 生成時のタイムスタンプ */
  timestamp: Date;
  /** 生成時の回転数 */
  rotations: number;
  /** コピー可能かどうか */
  copyable: boolean;
}

/**
 * アプリケーション状態の型定義
 */
export interface AppState {
  /** 地球回転データ */
  rotationData: EarthRotationData;
  /** 煽りフレーズデータ */
  tauntData: TauntData | null;
  /** リアルタイム更新が有効かどうか */
  isRealTimeActive: boolean;
  /** 最終更新時刻 */
  lastUpdateTime: number;
}