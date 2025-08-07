/**
 * 日時フォーマット関数群
 */

/**
 * 日時を読みやすい形式でフォーマット
 * @param date フォーマット対象の日時
 * @returns "2025年8月7日（水）12時34分56秒" 形式の文字列
 */
export function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = getWeekdayShort(date.getDay());
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${year}年${month}月${day}日（${weekday}）${hour}時${minute}分${second}秒`;
}

/**
 * 短縮形の曜日名を取得
 * @param dayOfWeek 曜日番号（0-6）
 * @returns 短縮形曜日名
 */
function getWeekdayShort(dayOfWeek: number): string {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return weekdays[dayOfWeek] || '?';
}

/**
 * ISO形式の日時文字列を生成
 * @param date 対象の日時
 * @returns ISO形式の文字列
 */
export function formatISODateTime(date: Date): string {
  if (!date || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toISOString();
}

/**
 * ローカル日時を適切にフォーマット
 * @param date 対象の日時
 * @returns ローカル形式の文字列
 */
export function formatLocalDateTime(date: Date): string {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}