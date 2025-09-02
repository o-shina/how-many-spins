/**
 * 煽りフレーズ生成とクリップボード操作を管理するクラス
 */
export class TauntGenerator {
  /**
   * 日本語曜日名の定数配列
   */
  private static readonly WEEKDAYS_JA = [
    '日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'
  ] as const;
  /**
   * 煽りフレーズを生成する
   * @param date 対象の日時
   * @param rotations 回転数
   * @returns 生成された煽りフレーズ
   */
  generateTaunt(date: Date, rotations: number): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = this.getWeekdayName(date.getDay());
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    
    const formattedRotations = this.formatRotationsForTaunt(rotations);
    
    return `いつ？${year}年${month}月${day}日${weekday}？${hour}時${minute}分${second}秒？地球が${formattedRotations}回転したとき！`;
  }

  /**
   * 煽りフレーズを生成する（フォーマット済み回転数版）
   * @param date 対象の日時
   * @param formattedRotations フォーマット済み回転数文字列
   * @returns 生成された煽りフレーズ
   */
  generateTauntWithFormattedRotations(date: Date, formattedRotations: string): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = this.getWeekdayName(date.getDay());
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    
    return `いつ？${year}年${month}月${day}日${weekday}？${hour}時${minute}分${second}秒？地球が${formattedRotations}回転したとき！`;
  }

  /**
   * テキストをクリップボードにコピーする
   * @param text コピーするテキスト
   * @returns コピー成功時はtrue、失敗時はfalse
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      // Clipboard APIが利用可能かチェック
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // フォールバック: 旧来の方法
        return this.fallbackCopy(text);
      }
    } catch (error) {
      console.warn('クリップボードへのコピーに失敗しました:', error);
      return this.fallbackCopy(text);
    }
  }

  /**
   * 曜日名を取得する
   * @param dayOfWeek 曜日番号（0-6）
   * @returns 曜日名
   */
  private getWeekdayName(dayOfWeek: number): string {
    return TauntGenerator.WEEKDAYS_JA[dayOfWeek] || '曜日';
  }

  /**
   * 煽りフレーズ用に回転数をフォーマット
   * @param rotations 回転数
   * @returns フォーマット済み回転数文字列
   */
  private formatRotationsForTaunt(rotations: number): string {
    return rotations.toLocaleString('ja-JP', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  /**
   * クリップボードAPIが使えない場合のフォールバック
   * @param text コピーするテキスト
   * @returns 成功時はtrue、失敗時はfalse
   */
  private fallbackCopy(text: string): boolean {
    try {
      // テキストエリアを作成してコピー
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      
      textarea.focus();
      textarea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      return successful;
    } catch (error) {
      console.warn('フォールバックコピーに失敗しました:', error);
      return false;
    }
  }
}