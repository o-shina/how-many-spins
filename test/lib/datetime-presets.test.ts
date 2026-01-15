import {
  DATETIME_PRESETS,
  CATEGORY_LABELS,
  getPresetsByCategory,
  getPresetById,
} from '@/lib/datetime-presets';

describe('datetime-presets', () => {
  describe('DATETIME_PRESETS', () => {
    test('プリセットが定義されていること', () => {
      expect(DATETIME_PRESETS.length).toBeGreaterThan(0);
    });

    test('各プリセットが必須フィールドを持つこと', () => {
      DATETIME_PRESETS.forEach((preset) => {
        expect(preset.id).toBeDefined();
        expect(preset.label).toBeDefined();
        expect(preset.description).toBeDefined();
        expect(preset.category).toBeDefined();
        expect(preset.datetime).toBeDefined();
        expect(preset.datetime.year).toBeDefined();
        expect(preset.datetime.month).toBeDefined();
        expect(preset.datetime.day).toBeDefined();
        expect(preset.datetime.hour).toBeDefined();
        expect(preset.datetime.minute).toBeDefined();
      });
    });

    test('各プリセットのIDが一意であること', () => {
      const ids = DATETIME_PRESETS.map((preset) => preset.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('日時の値が有効な範囲内であること', () => {
      DATETIME_PRESETS.forEach((preset) => {
        const { year, month, day, hour, minute } = preset.datetime;
        expect(year).toBeGreaterThanOrEqual(1);
        expect(year).toBeLessThanOrEqual(9999);
        expect(month).toBeGreaterThanOrEqual(1);
        expect(month).toBeLessThanOrEqual(12);
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(31);
        expect(hour).toBeGreaterThanOrEqual(0);
        expect(hour).toBeLessThanOrEqual(23);
        expect(minute).toBeGreaterThanOrEqual(0);
        expect(minute).toBeLessThanOrEqual(59);
      });
    });
  });

  describe('CATEGORY_LABELS', () => {
    test('全カテゴリのラベルが定義されていること', () => {
      expect(CATEGORY_LABELS.era).toBe('元号');
      expect(CATEGORY_LABELS.event).toBe('イベント');
      expect(CATEGORY_LABELS.milestone).toBe('マイルストーン');
    });
  });

  describe('getPresetsByCategory', () => {
    test('元号カテゴリのプリセットを取得できること', () => {
      const eraPresets = getPresetsByCategory('era');
      expect(eraPresets.length).toBeGreaterThan(0);
      eraPresets.forEach((preset) => {
        expect(preset.category).toBe('era');
      });
    });

    test('イベントカテゴリのプリセットを取得できること', () => {
      const eventPresets = getPresetsByCategory('event');
      expect(eventPresets.length).toBeGreaterThan(0);
      eventPresets.forEach((preset) => {
        expect(preset.category).toBe('event');
      });
    });

    test('マイルストーンカテゴリのプリセットを取得できること', () => {
      const milestonePresets = getPresetsByCategory('milestone');
      expect(milestonePresets.length).toBeGreaterThan(0);
      milestonePresets.forEach((preset) => {
        expect(preset.category).toBe('milestone');
      });
    });
  });

  describe('getPresetById', () => {
    test('存在するIDでプリセットを取得できること', () => {
      const preset = getPresetById('reiwa-start');
      expect(preset).toBeDefined();
      expect(preset?.label).toBe('令和元年');
    });

    test('存在しないIDの場合はundefinedを返すこと', () => {
      const preset = getPresetById('non-existent-id');
      expect(preset).toBeUndefined();
    });
  });

  describe('具体的なプリセットデータの検証', () => {
    test('令和元年のデータが正しいこと', () => {
      const preset = getPresetById('reiwa-start');
      expect(preset).toBeDefined();
      expect(preset?.datetime.year).toBe(2019);
      expect(preset?.datetime.month).toBe(4);
      expect(preset?.datetime.day).toBe(30);
      expect(preset?.datetime.hour).toBe(15);
      expect(preset?.datetime.minute).toBe(0);
    });

    test('2000年問題のデータが正しいこと', () => {
      const preset = getPresetById('y2k');
      expect(preset).toBeDefined();
      expect(preset?.datetime.year).toBe(2000);
      expect(preset?.datetime.month).toBe(1);
      expect(preset?.datetime.day).toBe(1);
      expect(preset?.datetime.hour).toBe(0);
      expect(preset?.datetime.minute).toBe(0);
    });

    test('UNIXエポックのデータが正しいこと', () => {
      const preset = getPresetById('unix-epoch');
      expect(preset).toBeDefined();
      expect(preset?.datetime.year).toBe(1970);
      expect(preset?.datetime.month).toBe(1);
      expect(preset?.datetime.day).toBe(1);
      expect(preset?.datetime.hour).toBe(0);
      expect(preset?.datetime.minute).toBe(0);
    });
  });
});
