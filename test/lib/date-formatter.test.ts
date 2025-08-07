import { formatDateTime, formatISODateTime, formatLocalDateTime } from '@/lib/date-formatter';

describe('date-formatter', () => {
  describe('formatDateTime', () => {
    test('正しい形式で日時をフォーマットすること', () => {
      const testDate = new Date('2025-08-07T12:34:56.789Z');
      const result = formatDateTime(testDate);
      
      expect(result).toMatch(/^\d{4}年\d{1,2}月\d{1,2}日（.）\d{1,2}時\d{1,2}分\d{1,2}秒$/);
    });

    test('曜日を正しく表示すること', () => {
      // 固定日時でのテスト（タイムゾーンに依存しない）
      const testDate = new Date('2025-08-10T12:00:00.000Z'); // 日曜日UTC
      const result = formatDateTime(testDate);
      
      expect(result).toContain('（日）');
    });

    test('年月日時分秒の各要素を含むこと', () => {
      const testDate = new Date('2025-01-05T01:02:03.000Z');
      const result = formatDateTime(testDate);
      
      expect(result).toContain('2025年');
      expect(result).toContain('月');
      expect(result).toContain('日');
      expect(result).toContain('時');
      expect(result).toContain('分');
      expect(result).toContain('秒');
    });

    test('12月31日を正しく表示すること', () => {
      const testDate = new Date('2025-12-31T12:00:00.000Z');
      const result = formatDateTime(testDate);
      
      expect(result).toContain('12月31日');
    });

    test('1月1日を正しく表示すること', () => {
      const testDate = new Date('2025-01-01T12:00:00.000Z');
      const result = formatDateTime(testDate);
      
      expect(result).toContain('2025年1月1日');
    });

    test('うるう年の2月29日を正しく表示すること', () => {
      const leapDate = new Date('2024-02-29T12:00:00.000Z');
      const result = formatDateTime(leapDate);
      
      expect(result).toContain('2024年2月29日');
    });

    test('異なる年の同じ月日で異なる結果を返すこと', () => {
      const date2024 = new Date('2024-08-07T12:00:00.000Z');
      const date2025 = new Date('2025-08-07T12:00:00.000Z');
      
      const result2024 = formatDateTime(date2024);
      const result2025 = formatDateTime(date2025);
      
      expect(result2024).toContain('2024年');
      expect(result2025).toContain('2025年');
      expect(result2024).not.toBe(result2025);
    });
  });

  describe('formatISODateTime', () => {
    test('正しいISO形式の文字列を返すこと', () => {
      const testDate = new Date('2025-08-07T12:34:56.789Z');
      const result = formatISODateTime(testDate);
      
      expect(result).toBe('2025-08-07T12:34:56.789Z');
    });

    test('タイムゾーンがUTCであること', () => {
      const testDate = new Date('2025-08-07T12:34:56.789Z');
      const result = formatISODateTime(testDate);
      
      expect(result.endsWith('Z')).toBe(true);
    });

    test('ミリ秒まで含むこと', () => {
      const testDate = new Date('2025-08-07T12:34:56.123Z');
      const result = formatISODateTime(testDate);
      
      expect(result).toContain('.123');
    });

    test('ミリ秒が0の場合も正しく表示すること', () => {
      const testDate = new Date('2025-08-07T12:34:56.000Z');
      const result = formatISODateTime(testDate);
      
      expect(result).toContain('.000');
    });

    test('年末年始の日時を正しく処理すること', () => {
      const newYear = new Date('2025-01-01T00:00:00.000Z');
      const yearEnd = new Date('2024-12-31T23:59:59.999Z');
      
      expect(formatISODateTime(newYear)).toBe('2025-01-01T00:00:00.000Z');
      expect(formatISODateTime(yearEnd)).toBe('2024-12-31T23:59:59.999Z');
    });
  });

  describe('formatLocalDateTime', () => {
    test('ローカル形式の文字列を返すこと', () => {
      const testDate = new Date('2025-08-07T12:34:56.789Z');
      const result = formatLocalDateTime(testDate);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('年月日時分秒の情報を含むこと', () => {
      const testDate = new Date('2025-08-07T12:34:56.789Z');
      const result = formatLocalDateTime(testDate);
      
      // 日本語ロケールでの形式を期待
      expect(result).toMatch(/2025/);
    });

    test('異なる日時で異なる結果を返すこと', () => {
      const date1 = new Date('2025-01-01T00:00:00.000Z');
      const date2 = new Date('2025-12-31T23:59:59.999Z');
      
      const result1 = formatLocalDateTime(date1);
      const result2 = formatLocalDateTime(date2);
      
      expect(result1).not.toBe(result2);
    });

    test('同じ日時で同じ結果を返すこと', () => {
      const date1 = new Date('2025-08-07T12:34:56.789Z');
      const date2 = new Date('2025-08-07T12:34:56.789Z');
      
      const result1 = formatLocalDateTime(date1);
      const result2 = formatLocalDateTime(date2);
      
      expect(result1).toBe(result2);
    });

    test('うるう年の日付を正しく処理すること', () => {
      const leapDate = new Date('2024-02-29T12:00:00.000Z');
      const result = formatLocalDateTime(leapDate);
      
      expect(result).toMatch(/2024/);
    });
  });

  describe('エラーハンドリングと境界値', () => {
    test('無効な日付を処理できること', () => {
      const invalidDate = new Date('invalid');
      
      expect(() => formatDateTime(invalidDate)).not.toThrow();
      expect(() => formatISODateTime(invalidDate)).not.toThrow();
      expect(() => formatLocalDateTime(invalidDate)).not.toThrow();
      
      expect(formatISODateTime(invalidDate)).toBe('Invalid Date');
    });

    test('極端に古い日付を処理できること', () => {
      const oldDate = new Date('0001-01-01T00:00:00.000Z');
      
      expect(() => formatDateTime(oldDate)).not.toThrow();
      expect(() => formatISODateTime(oldDate)).not.toThrow();
      expect(() => formatLocalDateTime(oldDate)).not.toThrow();
    });

    test('極端に新しい日付を処理できること', () => {
      const futureDate = new Date('9999-12-31T23:59:59.999Z');
      
      expect(() => formatDateTime(futureDate)).not.toThrow();
      expect(() => formatISODateTime(futureDate)).not.toThrow();
      expect(() => formatLocalDateTime(futureDate)).not.toThrow();
    });

    test('タイムゾーンの異なる同じ瞬間を処理できること', () => {
      const utcDate = new Date('2025-08-07T12:00:00.000Z');
      const localDate = new Date('2025-08-07T21:00:00.000+09:00'); // JST
      
      // UTCでは同じ瞬間だが、フォーマット結果は異なる可能性がある
      const utcResult = formatDateTime(utcDate);
      const localResult = formatDateTime(localDate);
      
      expect(typeof utcResult).toBe('string');
      expect(typeof localResult).toBe('string');
    });
  });

  describe('一貫性テスト', () => {
    test('同じ日時オブジェクトで一貫した結果を返すこと', () => {
      const testDate = new Date('2025-08-07T12:34:56.789Z');
      
      const result1 = formatDateTime(testDate);
      const result2 = formatDateTime(testDate);
      const result3 = formatDateTime(testDate);
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    test('同等の日時オブジェクトで同じ結果を返すこと', () => {
      const date1 = new Date('2025-08-07T12:34:56.789Z');
      const date2 = new Date(date1.getTime());
      
      expect(formatDateTime(date1)).toBe(formatDateTime(date2));
      expect(formatISODateTime(date1)).toBe(formatISODateTime(date2));
    });
  });
});