import { EarthRotationCalculator } from '@/lib/earth-rotation-calculator';

describe('EarthRotationCalculator', () => {
  let calculator: EarthRotationCalculator;

  beforeEach(() => {
    calculator = new EarthRotationCalculator();
  });

  describe('calculateRotationsFromDate', () => {
    test('1970年1月1日でhistorical rotationsを返すこと', () => {
      const epochDate = new Date('1970-01-01T00:00:00.000Z');
      const rotations = calculator.calculateRotationsFromDate(epochDate);
      expect(rotations).toBe(719163.0); // HISTORICAL_ROTATIONS
    });

    test('1恒星日後で1回転増加すること', () => {
      const baseDate = new Date('1970-01-01T00:00:00.000Z');
      const oneDayLater = new Date(baseDate.getTime() + 86164000); // 1恒星日後
      const rotations = calculator.calculateRotationsFromDate(oneDayLater);
      expect(rotations).toBe(719164.0); // HISTORICAL_ROTATIONS + 1
    });

    test('現実的な日時で適切な回転数を計算すること', () => {
      const testDate = new Date('2025-01-01T00:00:00.000Z');
      const rotations = calculator.calculateRotationsFromDate(testDate);
      // 1970年からの55年 ≈ 20075日 ≈ 20075回転 + HISTORICAL_ROTATIONS
      expect(rotations).toBeGreaterThan(739000);
      expect(rotations).toBeLessThan(741000);
    });

    test('小数点第6位まで精度を保持すること', () => {
      const baseDate = new Date('1970-01-01T00:00:00.000Z');
      const halfDay = new Date(baseDate.getTime() + 43082000); // 0.5恒星日後
      const rotations = calculator.calculateRotationsFromDate(halfDay);
      expect(rotations).toBe(719163.5); // HISTORICAL_ROTATIONS + 0.5
    });

    test('無効な日時でエラーを投げること', () => {
      const invalidDate = new Date('invalid');
      expect(() => {
        calculator.calculateRotationsFromDate(invalidDate);
      }).toThrow('無効な日時が指定されました');
    });
  });

  describe('calculateDateFromRotations', () => {
    test('0回転で正しい日時を返すこと', () => {
      const date = calculator.calculateDateFromRotations(0);
      // 0回転は HISTORICAL_ROTATIONS分前の日時
      expect(date instanceof Date).toBe(true);
      expect(!isNaN(date.getTime())).toBe(true);
    });

    test('HISTORICAL_ROTATIONS回転で1970年1月1日を返すこと', () => {
      const date = calculator.calculateDateFromRotations(719163.0);
      const expectedDate = new Date('1970-01-01T00:00:00.000Z');
      expect(date.getTime()).toBe(expectedDate.getTime());
    });

    test('小数回転で適切な時間を返すこと', () => {
      const date = calculator.calculateDateFromRotations(719163.5);
      const expectedDate = new Date('1970-01-01T00:00:00.000Z');
      expectedDate.setTime(expectedDate.getTime() + 43082000); // 0.5恒星日
      expect(date.getTime()).toBe(expectedDate.getTime());
    });

    test('負の回転数でエラーを投げること', () => {
      expect(() => {
        calculator.calculateDateFromRotations(-1);
      }).toThrow('無効な回転数が指定されました');
    });

    test('NaNでエラーを投げること', () => {
      expect(() => {
        calculator.calculateDateFromRotations(NaN);
      }).toThrow('無効な回転数が指定されました');
    });

    test('Infinityでエラーを投げること', () => {
      expect(() => {
        calculator.calculateDateFromRotations(Infinity);
      }).toThrow('無効な回転数が指定されました');
    });
  });

  describe('getCurrentRotations', () => {
    test('現在時刻での回転数を返すこと', () => {
      // 実際の現在時刻を使用してテスト
      const rotations = calculator.getCurrentRotations();
      expect(rotations).toBeGreaterThan(0);
      expect(typeof rotations).toBe('number');
      expect(isFinite(rotations)).toBe(true);
    });
  });

  describe('formatRotations', () => {
    test('整数回転数を適切にフォーマットすること', () => {
      const formatted = calculator.formatRotations(1234567);
      expect(formatted).toBe('1,234,567.000000 回転');
    });

    test('小数回転数を適切にフォーマットすること', () => {
      const formatted = calculator.formatRotations(1234567.123456);
      expect(formatted).toBe('1,234,567.123456 回転');
    });

    test('小数点第6位まで表示すること', () => {
      const formatted = calculator.formatRotations(123.1);
      expect(formatted).toBe('123.100000 回転');
    });

    test('7桁以上の小数を6桁に丸めること', () => {
      const formatted = calculator.formatRotations(123.1234567);
      expect(formatted).toBe('123.123457 回転');
    });
  });

  describe('逆変換の整合性', () => {
    test('日時→回転数→日時の変換で元の値に戻ること', () => {
      const originalDate = new Date('2025-08-06T12:34:56.000Z');
      const rotations = calculator.calculateRotationsFromDate(originalDate);
      const convertedDate = calculator.calculateDateFromRotations(rotations);
      
      // ミリ秒レベルでの誤差を考慮して1秒以内の差であることを確認
      const timeDiff = Math.abs(originalDate.getTime() - convertedDate.getTime());
      expect(timeDiff).toBeLessThan(1000);
    });

    test('回転数→日時→回転数の変換で元の値に戻ること', () => {
      const originalRotations = 1234567.123456;
      const date = calculator.calculateDateFromRotations(originalRotations);
      const convertedRotations = calculator.calculateRotationsFromDate(date);
      
      // 小数点第6位までの精度で一致することを確認
      expect(Math.abs(originalRotations - convertedRotations)).toBeLessThan(0.000001);
    });
  });
});