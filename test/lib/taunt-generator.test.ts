import { TauntGenerator } from '@/lib/taunt-generator';

// Mock for document.execCommand
Object.assign(document, {
  execCommand: jest.fn(() => true),
});

describe('TauntGenerator', () => {
  let generator: TauntGenerator;

  beforeEach(() => {
    generator = new TauntGenerator();
    jest.clearAllMocks();
    
    // console.warnをモック化してテスト出力をクリーンにする
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    // 各テスト前にクリップボードAPIを復元
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('generateTaunt', () => {
    test('正しい形式の煽りフレーズを生成すること', () => {
      const testDate = new Date('2025-08-07T12:34:56.789Z');
      const testRotations = 1688512943.123456;
      
      const result = generator.generateTaunt(testDate, testRotations);
      
      expect(result).toContain('いつ？');
      expect(result).toContain('2025年8月7日');
      expect(result).toContain('時34分56秒');
      expect(result).toContain('地球が');
      expect(result).toContain('回転したとき！');
    });

    test('曜日を正しく含むこと', () => {
      const mondayDate = new Date('2025-08-04T12:00:00.000Z'); 
      const tuesdayDate = new Date('2025-08-05T12:00:00.000Z'); 
      const sundayDate = new Date('2025-08-10T12:00:00.000Z'); 
      
      expect(generator.generateTaunt(mondayDate, 1000)).toContain('曜日');
      expect(generator.generateTaunt(tuesdayDate, 1000)).toContain('曜日');
      expect(generator.generateTaunt(sundayDate, 1000)).toContain('曜日');
    });

    test('回転数を整数でフォーマットすること', () => {
      const testDate = new Date('2025-08-07T12:00:00.000Z');
      const testRotations = 1234567.89;
      
      const result = generator.generateTaunt(testDate, testRotations);
      
      expect(result).toMatch(/1,234,568回転/);
      expect(result).not.toContain('1,234,567.89');
    });

    test('異なる日時で異なるフレーズを生成すること', () => {
      const date1 = new Date('2025-01-01T00:00:00.000Z');
      const date2 = new Date('2025-12-31T23:59:59.999Z');
      
      const phrase1 = generator.generateTaunt(date1, 1000);
      const phrase2 = generator.generateTaunt(date2, 2000);
      
      expect(phrase1).not.toBe(phrase2);
    });

    test('時分秒を含むこと', () => {
      const testDate = new Date('2025-08-07T00:00:00.000Z');
      const result = generator.generateTaunt(testDate, 1000);
      
      expect(result).toContain('時');
      expect(result).toContain('分');
      expect(result).toContain('秒');
    });

    test('月日を含むこと', () => {
      const testDate = new Date('2025-01-05T01:02:03.000Z');
      const result = generator.generateTaunt(testDate, 1000);
      
      expect(result).toContain('2025年1月5日');
      expect(result).toContain('時2分3秒');
    });
  });

  describe('copyToClipboard', () => {
    test('Clipboard APIが利用可能な場合に正常にコピーすること', async () => {
      const testText = 'テストテキスト';
      (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
      
      const result = await generator.copyToClipboard(testText);
      
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText);
    });

    test('Clipboard APIが失敗した場合にフォールバックを使用すること', async () => {
      const testText = 'テストテキスト';
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Permission denied'));
      
      // DOMメソッドのモック
      const mockTextarea = {
        value: '',
        style: {},
        focus: jest.fn(),
        select: jest.fn(),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockTextarea as any);
      jest.spyOn(document.body, 'appendChild').mockImplementation();
      jest.spyOn(document.body, 'removeChild').mockImplementation();
      (document.execCommand as jest.Mock).mockReturnValue(true);
      
      const result = await generator.copyToClipboard(testText);
      
      expect(result).toBe(true);
      expect(document.createElement).toHaveBeenCalledWith('textarea');
    });

    test('Clipboard APIが利用不可でフォールバックも失敗した場合にfalseを返すこと', async () => {
      const testText = 'テストテキスト';
      
      // Clipboard APIを無効化
      Object.assign(navigator, {
        clipboard: undefined,
      });
      
      // フォールバックも失敗させる
      (document.execCommand as jest.Mock).mockReturnValue(false);
      
      const mockTextarea = {
        value: '',
        style: {},
        focus: jest.fn(),
        select: jest.fn(),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockTextarea as any);
      jest.spyOn(document.body, 'appendChild').mockImplementation();
      jest.spyOn(document.body, 'removeChild').mockImplementation();
      
      const result = await generator.copyToClipboard(testText);
      
      expect(result).toBe(false);
    });

    test('空文字列をコピーできること', async () => {
      const testText = '';
      (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
      
      const result = await generator.copyToClipboard(testText);
      
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    });

    test('長いテキストをコピーできること', async () => {
      const longText = 'a'.repeat(10000);
      (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
      
      const result = await generator.copyToClipboard(longText);
      
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(longText);
    });

    test('特殊文字を含むテキストをコピーできること', async () => {
      const specialText = '特殊文字: 🚀 &lt;&gt; "quotes" \'apostrophe\' \n\r\t';
      (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
      
      const result = await generator.copyToClipboard(specialText);
      
      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(specialText);
    });
  });

  describe('統合テスト', () => {
    test('生成とコピーの一連の流れが正常に動作すること', async () => {
      const testDate = new Date('2025-08-07T12:34:56.000Z');
      const testRotations = 1234567;
      
      const phrase = generator.generateTaunt(testDate, testRotations);
      
      (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
      const copyResult = await generator.copyToClipboard(phrase);
      
      expect(phrase).toContain('いつ？');
      expect(phrase).toContain('2025年8月7日');
      expect(copyResult).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(phrase);
    });

    test('複数回の生成とコピーが正常に動作すること', async () => {
      const dates = [
        new Date('2025-01-01T00:00:00.000Z'),
        new Date('2025-06-15T12:30:45.000Z'),
        new Date('2025-12-31T23:59:59.000Z'),
      ];
      
      const rotations = [1000000, 2000000, 3000000];
      
      (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
      
      for (let i = 0; i < dates.length; i++) {
        const phrase = generator.generateTaunt(dates[i], rotations[i]);
        const copyResult = await generator.copyToClipboard(phrase);
        
        expect(phrase).toContain('いつ？');
        expect(copyResult).toBe(true);
      }
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(3);
    });
  });

  describe('エラーハンドリング', () => {
    test('フォールバック中の例外を適切に処理すること', async () => {
      const testText = 'テストテキスト';
      
      // Clipboard APIを無効化
      Object.assign(navigator, {
        clipboard: undefined,
      });
      
      // document.createElementで例外を発生させる
      jest.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('DOM操作エラー');
      });
      
      const result = await generator.copyToClipboard(testText);
      
      expect(result).toBe(false);
    });
  });
});