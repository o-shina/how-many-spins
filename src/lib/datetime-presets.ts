import { DateTimePreset } from '@/types/earth-rotation';

/**
 * 日時プリセットデータ
 * 歴史的なイベントや元号の始まりなど、よく使われる日時を定義
 */
export const DATETIME_PRESETS: DateTimePreset[] = [
  // 元号カテゴリ
  {
    id: 'reiwa-start',
    label: '令和元年',
    description: '2019年5月1日 00:00 JST（2019年4月30日 15:00 UTC）',
    category: 'era',
    datetime: {
      year: 2019,
      month: 4,
      day: 30,
      hour: 15,
      minute: 0,
    },
  },
  {
    id: 'heisei-start',
    label: '平成元年',
    description: '1989年1月8日 00:00 JST（1989年1月7日 15:00 UTC）',
    category: 'era',
    datetime: {
      year: 1989,
      month: 1,
      day: 7,
      hour: 15,
      minute: 0,
    },
  },
  {
    id: 'showa-start',
    label: '昭和元年',
    description: '1926年12月25日 00:00 JST（1926年12月24日 15:00 UTC）',
    category: 'era',
    datetime: {
      year: 1926,
      month: 12,
      day: 24,
      hour: 15,
      minute: 0,
    },
  },
  // イベントカテゴリ
  {
    id: 'kamakura-1192',
    label: '鎌倉幕府成立',
    description: '1192年7月12日 源頼朝が征夷大将軍に就任',
    category: 'event',
    datetime: {
      year: 1192,
      month: 7,
      day: 12,
      hour: 0,
      minute: 0,
    },
  },
  {
    id: 'y2k',
    label: '2000年問題',
    description: '2000年1月1日 00:00 UTC',
    category: 'event',
    datetime: {
      year: 2000,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
    },
  },
  {
    id: 'tokyo-olympics-2020',
    label: '東京五輪2020開会式',
    description: '2021年7月23日 20:00 JST（11:00 UTC）',
    category: 'event',
    datetime: {
      year: 2021,
      month: 7,
      day: 23,
      hour: 11,
      minute: 0,
    },
  },
  {
    id: 'moon-landing',
    label: '月面着陸（アポロ11号）',
    description: '1969年7月20日 20:17 UTC',
    category: 'event',
    datetime: {
      year: 1969,
      month: 7,
      day: 20,
      hour: 20,
      minute: 17,
    },
  },
  {
    id: 'osaka-expo-2025',
    label: '大阪・関西万博開幕',
    description: '2025年4月13日 10:00 JST（01:00 UTC）',
    category: 'event',
    datetime: {
      year: 2025,
      month: 4,
      day: 13,
      hour: 1,
      minute: 0,
    },
  },
  // マイルストーンカテゴリ
  {
    id: 'unix-epoch',
    label: 'UNIXエポック',
    description: '1970年1月1日 00:00 UTC',
    category: 'milestone',
    datetime: {
      year: 1970,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
    },
  },
  {
    id: 'millennium',
    label: '21世紀の始まり',
    description: '2001年1月1日 00:00 UTC',
    category: 'milestone',
    datetime: {
      year: 2001,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
    },
  },
];

/**
 * カテゴリ別にプリセットを取得
 */
export function getPresetsByCategory(
  category: DateTimePreset['category']
): DateTimePreset[] {
  return DATETIME_PRESETS.filter((preset) => preset.category === category);
}

/**
 * IDからプリセットを取得
 */
export function getPresetById(id: string): DateTimePreset | undefined {
  return DATETIME_PRESETS.find((preset) => preset.id === id);
}

/**
 * カテゴリの日本語ラベル
 */
export const CATEGORY_LABELS: Record<DateTimePreset['category'], string> = {
  era: '元号',
  event: 'イベント',
  milestone: 'マイルストーン',
};
