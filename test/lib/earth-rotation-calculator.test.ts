import { EarthRotationCalculator } from '@/lib/earth-rotation-calculator';

describe('EarthRotationCalculator', () => {
  let calculator: EarthRotationCalculator;

  beforeEach(() => {
    calculator = new EarthRotationCalculator();
  });

  describe('calculateRotationsFromDate', () => {
    test('Returns 1 rotation after one sidereal day (86164 seconds)', () => {
      const baseDate = new Date('2025-01-01T00:00:00.000Z');
      const oneSiderealDay = new Date(baseDate.getTime() + 86164000);
      const baseRotations = calculator.calculateRotationsFromDate(baseDate);
      const result = calculator.calculateRotationsFromDate(oneSiderealDay);
      expect(result - baseRotations).toBeCloseTo(1, 6);
    });

    test('Returns positive rotation count for current date', () => {
      const now = new Date();
      const result = calculator.calculateRotationsFromDate(now);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    test('小数点第6位まで精度を保持すること', () => {
      const testDate = new Date('2025-01-01T12:30:45.123Z');
      const result = calculator.calculateRotationsFromDate(testDate);
      const decimalPlaces = (result.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(6);
    });

    test('無効な日時でエラーをスローすること', () => {
      const invalidDate = new Date('invalid');
      expect(() => {
        calculator.calculateRotationsFromDate(invalidDate);
      }).toThrow('無効な日時が指定されました');
    });

    test('異なる日時で異なる回転数を返すこと', () => {
      const date1 = new Date('2025-01-01T00:00:00.000Z');
      const date2 = new Date('2025-01-02T00:00:00.000Z');
      const result1 = calculator.calculateRotationsFromDate(date1);
      const result2 = calculator.calculateRotationsFromDate(date2);
      expect(result2).toBeGreaterThan(result1);
    });
  });

  describe('calculateDateFromRotations', () => {
    test('1回転で恒星日分後の日時を返すこと', () => {
      const baseDate = new Date('2025-01-01T00:00:00.000Z');
      const baseRotations = calculator.calculateRotationsFromDate(baseDate);
      const result = calculator.calculateDateFromRotations(baseRotations + 1);
      const expectedDate = new Date(baseDate.getTime() + 86164000);
      expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -3);
    });

    test('負の回転数でエラーをスローすること', () => {
      expect(() => {
        calculator.calculateDateFromRotations(-1);
      }).toThrow('無効な回転数が指定されました');
    });

    test('NaNでエラーをスローすること', () => {
      expect(() => {
        calculator.calculateDateFromRotations(NaN);
      }).toThrow('無効な回転数が指定されました');
    });

    test('Infinityでエラーをスローすること', () => {
      expect(() => {
        calculator.calculateDateFromRotations(Infinity);
      }).toThrow('無効な回転数が指定されました');
    });

    test('大きな回転数で未来の日時を正しく計算すること', () => {
      const currentRotations = calculator.getCurrentRotations();
      const largeRotations = currentRotations + 1000000;
      const result = calculator.calculateDateFromRotations(largeRotations);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThan(new Date().getTime());
    });
  });

  describe('getCurrentRotations', () => {
    test('現在の回転数を返すこと', () => {
      const result = calculator.getCurrentRotations();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    test('連続して呼び出すと増加する値を返すこと', async () => {
      const result1 = calculator.getCurrentRotations();
      
      // 少し待機
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result2 = calculator.getCurrentRotations();
      expect(result2).toBeGreaterThanOrEqual(result1);
    });
  });

  describe('formatRotations', () => {
    test('正しい形式でフォーマットすること', () => {
      const result = calculator.formatRotations(1234567.123456);
      expect(result).toMatch(/^1,234,567\.123456 回転$/);
    });

    test('小数点第6位まで表示すること', () => {
      const result = calculator.formatRotations(123.1);
      expect(result).toBe('123.100000 回転');
    });

    test('大きな数値を正しくフォーマットすること', () => {
      const result = calculator.formatRotations(1234567890.123456);
      expect(result).toMatch(/^1,234,567,890\.123456 回転$/);
    });

    test('0を正しくフォーマットすること', () => {
      const result = calculator.formatRotations(0);
      expect(result).toBe('0.000000 回転');
    });

    test('小さな小数を正しくフォーマットすること', () => {
      const result = calculator.formatRotations(0.000001);
      expect(result).toBe('0.000001 回転');
    });
  });

  describe('相互変換の整合性', () => {
    test('日時→回転数→日時の変換で元の値に戻ること', () => {
      const originalDate = new Date('2025-01-01T12:00:00.000Z');
      const rotations = calculator.calculateRotationsFromDate(originalDate);
      const convertedDate = calculator.calculateDateFromRotations(rotations);
      
      // ミリ秒の精度差を考慮して許容範囲内で比較
      expect(Math.abs(convertedDate.getTime() - originalDate.getTime())).toBeLessThan(1000);
    });

    test('回転数→日時→回転数の変換で元の値に戻ること', () => {
      const currentRotations = calculator.getCurrentRotations();
      const originalRotations = Math.round(currentRotations * 1000000) / 1000000; // 精度調整
      const date = calculator.calculateDateFromRotations(originalRotations);
      const convertedRotations = calculator.calculateRotationsFromDate(date);
      
      // 浮動小数点の精度を考慮
      expect(Math.abs(convertedRotations - originalRotations)).toBeLessThan(0.000001);
    });
  });

  describe('境界値テスト', () => {
    test('非常に大きな回転数を処理できること', () => {
      const largeRotations = 1000000000; // 10億回転
      expect(() => {
        calculator.calculateDateFromRotations(largeRotations);
      }).not.toThrow();
    });

    test('非常に小さな回転数を処理できること', () => {
      const smallRotations = 0.000001;
      expect(() => {
        calculator.calculateDateFromRotations(smallRotations);
      }).not.toThrow();
    });

    test('現在に近い日時を処理できること', () => {
      const recentDate = new Date('2025-01-01T00:00:00.000Z');
      expect(() => {
        calculator.calculateRotationsFromDate(recentDate);
      }).not.toThrow();
    });

    test('未来の日時を処理できること', () => {
      const futureDate = new Date('2030-12-31T23:59:59.999Z');
      expect(() => {
        calculator.calculateRotationsFromDate(futureDate);
      }).not.toThrow();
    });
  });
});