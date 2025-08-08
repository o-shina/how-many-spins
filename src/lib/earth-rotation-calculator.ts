/**
 * 地球の自転回数を計算するクラス
 * 恒星日（86,164秒）を基準とした高精度計算を提供
 */
export class EarthRotationCalculator {
  // 恒星日（ミリ秒）: 23時間56分4秒 = 86,164秒
  private static readonly SIDEREAL_DAY_MS = 86164000;
  
  // 計算開始基準日: Unix epoch (1970年1月1日) 00:00:00 UTC
  // 西暦1年1月1日からの累積回転数を加算して整合性を保つ
  private static readonly EPOCH_START = new Date('1970-01-01T00:00:00.000Z');
  /**
   * 西暦1年1月1日から1970年1月1日までの地球の累積自転回数（恒星日基準）
   * 
   * 計算方法:
   * - 基準日: 1年1月1日 00:00:00 UTC から 1970年1月1日 00:00:00 UTC までの経過日数を求める
   * - グレゴリオ暦の規則に従い、両日付の間の日数は 719,163 日
   *   - 参考: https://howardhinnant.github.io/date_algorithms.html#days_from_civil
   *   - 参考: "Astronomical Algorithms" (Jean Meeus) Table 7.A
   * - 恒星日（1日 = 86,164秒）を基準とするため、日数 = 回転数とみなす
   * 
   * よって、HISTORICAL_ROTATIONS = 719,163.0
   */
  private static readonly HISTORICAL_ROTATIONS = 719163.0;

  /**
   * 指定された日時での地球の累積自転回数を計算
   * @param date 計算対象の日時
   * @returns 累積自転回数（小数点第6位まで）
   */
  calculateRotationsFromDate(date: Date): number {
    if (!this.isValidDate(date)) {
      throw new Error('無効な日時が指定されました');
    }

    const timeDiff = date.getTime() - EarthRotationCalculator.EPOCH_START.getTime();
    const rotationsFromEpoch = timeDiff / EarthRotationCalculator.SIDEREAL_DAY_MS;
    
    // 西暦1年からの累積回転数を計算
    const totalRotations = EarthRotationCalculator.HISTORICAL_ROTATIONS + rotationsFromEpoch;
    
    // 小数点第6位まで精度を保持
    return Math.round(totalRotations * 1000000) / 1000000;
  }

  /**
   * 自転回数から対応する日時を逆算
   * @param rotations 自転回数
   * @returns 対応する日時
   */
  calculateDateFromRotations(rotations: number): Date {
    if (!this.isValidRotations(rotations)) {
      throw new Error('無効な回転数が指定されました');
    }

    // 西暦1年からの累積回転数から1970年以降の回転数を算出
    const rotationsFromEpoch = rotations - EarthRotationCalculator.HISTORICAL_ROTATIONS;
    const milliseconds = rotationsFromEpoch * EarthRotationCalculator.SIDEREAL_DAY_MS;
    const targetTime = EarthRotationCalculator.EPOCH_START.getTime() + milliseconds;
    
    return new Date(targetTime);
  }

  /**
   * 現在時刻での地球の累積自転回数を取得
   * @returns 現在の累積自転回数
   */
  getCurrentRotations(): number {
    return this.calculateRotationsFromDate(new Date());
  }

  /**
   * 自転回数を読みやすい形式でフォーマット
   * @param rotations 自転回数
   * @returns "1,234,567.123456 回転" 形式の文字列
   */
  formatRotations(rotations: number): string {
    const formattedNumber = rotations.toLocaleString('ja-JP', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    });
    
    return `${formattedNumber} 回転`;
  }

  /**
   * 日時の妥当性を検証
   * @param date 検証対象の日時
   * @returns 有効な日時の場合true
   */
  private isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * 回転数の妥当性を検証
   * @param rotations 検証対象の回転数
   * @returns 有効な回転数の場合true
   */
  private isValidRotations(rotations: number): boolean {
    return typeof rotations === 'number' && 
           !isNaN(rotations) && 
           isFinite(rotations) && 
           rotations >= 0;
  }
}