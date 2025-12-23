'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { EarthRotationCalculator } from '@/lib/earth-rotation-calculator';
import { formatDateTime } from '@/lib/date-formatter';
import { useDisplayFormat } from '@/hooks/useDisplayFormat';
import DisplayFormatToggle from './DisplayFormatToggle';

interface DateTimeInputValues {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
}

interface CalculationResult {
  rotationCount: number;
  formattedDateTime: string;
  inputDate: Date;
  isFuture: boolean;
}

type InputMode = 'text' | 'select';

/**
 * 日時指定入力コンポーネント
 * 任意の日時を入力して地球の回転数を計算
 */
function DateTimeInput() {
  const [inputMode, setInputMode] = useState<InputMode>('select');
  const [inputValues, setInputValues] = useState<DateTimeInputValues>({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculator = useMemo(() => new EarthRotationCalculator(), []);
  const { formatRotation, isLoaded: formatLoaded } = useDisplayFormat();

  /**
   * 年の選択肢を生成（現在年の±100年）
   */
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = currentYear - 100; y <= currentYear + 100; y++) {
      years.push(y);
    }
    return years;
  }, []);

  /**
   * 月の選択肢（1-12）
   */
  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, []);

  /**
   * 日の選択肢（1-31）
   */
  const dayOptions = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  }, []);

  /**
   * 時の選択肢（0-23）
   */
  const hourOptions = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i);
  }, []);

  /**
   * 分の選択肢（0-59）
   */
  const minuteOptions = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => i);
  }, []);

  /**
   * 入力値を更新
   */
  const handleInputChange = useCallback((field: keyof DateTimeInputValues, value: string) => {
    // 数値のみ許可
    if (value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    setInputValues(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  /**
   * 日時のバリデーション
   */
  const validateDateTime = useCallback((): Date | null => {
    const { year, month, day, hour, minute } = inputValues;

    // 必須入力チェック
    if (!year || !month || !day || !hour || !minute) {
      setError('すべての項目を入力してください');
      return null;
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const hourNum = parseInt(hour, 10);
    const minuteNum = parseInt(minute, 10);

    // 範囲チェック
    if (yearNum < 1 || yearNum > 9999) {
      setError('年は1〜9999の範囲で入力してください');
      return null;
    }
    if (monthNum < 1 || monthNum > 12) {
      setError('月は1〜12の範囲で入力してください');
      return null;
    }
    if (dayNum < 1 || dayNum > 31) {
      setError('日は1〜31の範囲で入力してください');
      return null;
    }
    if (hourNum < 0 || hourNum > 23) {
      setError('時は0〜23の範囲で入力してください');
      return null;
    }
    if (minuteNum < 0 || minuteNum > 59) {
      setError('分は0〜59の範囲で入力してください');
      return null;
    }

    // Dateオブジェクト生成（UTC）
    const date = new Date(Date.UTC(yearNum, monthNum - 1, dayNum, hourNum, minuteNum, 0, 0));

    // 日付の妥当性チェック（存在しない日付の検証）
    if (
      date.getUTCFullYear() !== yearNum ||
      date.getUTCMonth() !== monthNum - 1 ||
      date.getUTCDate() !== dayNum
    ) {
      setError('存在しない日付が入力されています（例: 2月30日）');
      return null;
    }

    return date;
  }, [inputValues]);

  /**
   * 計算実行
   */
  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setError(null);
    setResult(null);

    try {
      const date = validateDateTime();
      if (!date) {
        setIsCalculating(false);
        return;
      }

      const rotations = calculator.calculateRotationsFromDate(date);
      const formattedDate = formatDateTime(date);
      const now = new Date();
      const isFuture = date.getTime() > now.getTime();

      setResult({
        rotationCount: rotations,
        formattedDateTime: formattedDate,
        inputDate: date,
        isFuture,
      });
    } catch (err) {
      setError('計算中にエラーが発生しました');
      console.error('回転数計算エラー:', err);
    } finally {
      setIsCalculating(false);
    }
  }, [validateDateTime, calculator]);

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleCalculate();
  }, [handleCalculate]);

  /**
   * クリアボタン
   */
  const handleClear = useCallback(() => {
    setInputValues({
      year: '',
      month: '',
      day: '',
      hour: '',
      minute: '',
    });
    setResult(null);
    setError(null);
  }, []);

  if (!formatLoaded) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
          指定した日時の地球回転数を計算
        </h2>

        {/* 入力モード切り替え */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setInputMode('select')}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${inputMode === 'select'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
              aria-pressed={inputMode === 'select'}
              aria-label="プルダウン入力に切り替え"
            >
              プルダウン
            </button>
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${inputMode === 'text'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
              aria-pressed={inputMode === 'text'}
              aria-label="テキスト入力に切り替え"
            >
              テキスト入力
            </button>
          </div>
        </div>

        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 日付入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              日付（UTC）
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {inputMode === 'select' ? (
                <>
                  {/* プルダウン：年 */}
                  <div className="flex items-center">
                    <select
                      value={inputValues.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      aria-label="年"
                    >
                      <option value="">--</option>
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <span className="ml-1 text-gray-600">年</span>
                  </div>
                  {/* プルダウン：月 */}
                  <div className="flex items-center">
                    <select
                      value={inputValues.month}
                      onChange={(e) => handleInputChange('month', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      aria-label="月"
                    >
                      <option value="">--</option>
                      {monthOptions.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <span className="ml-1 text-gray-600">月</span>
                  </div>
                  {/* プルダウン：日 */}
                  <div className="flex items-center">
                    <select
                      value={inputValues.day}
                      onChange={(e) => handleInputChange('day', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      aria-label="日"
                    >
                      <option value="">--</option>
                      {dayOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <span className="ml-1 text-gray-600">日</span>
                  </div>
                </>
              ) : (
                <>
                  {/* テキスト入力：年 */}
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={inputValues.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="2025"
                      maxLength={4}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="年"
                    />
                    <span className="ml-1 text-gray-600">年</span>
                  </div>
                  {/* テキスト入力：月 */}
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={inputValues.month}
                      onChange={(e) => handleInputChange('month', e.target.value)}
                      placeholder="12"
                      maxLength={2}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="月"
                    />
                    <span className="ml-1 text-gray-600">月</span>
                  </div>
                  {/* テキスト入力：日 */}
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={inputValues.day}
                      onChange={(e) => handleInputChange('day', e.target.value)}
                      placeholder="31"
                      maxLength={2}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="日"
                    />
                    <span className="ml-1 text-gray-600">日</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 時刻入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              時刻（UTC）
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {inputMode === 'select' ? (
                <>
                  {/* プルダウン：時 */}
                  <div className="flex items-center">
                    <select
                      value={inputValues.hour}
                      onChange={(e) => handleInputChange('hour', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      aria-label="時"
                    >
                      <option value="">--</option>
                      {hourOptions.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <span className="ml-1 text-gray-600">時</span>
                  </div>
                  {/* プルダウン：分 */}
                  <div className="flex items-center">
                    <select
                      value={inputValues.minute}
                      onChange={(e) => handleInputChange('minute', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      aria-label="分"
                    >
                      <option value="">--</option>
                      {minuteOptions.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <span className="ml-1 text-gray-600">分</span>
                  </div>
                </>
              ) : (
                <>
                  {/* テキスト入力：時 */}
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={inputValues.hour}
                      onChange={(e) => handleInputChange('hour', e.target.value)}
                      placeholder="23"
                      maxLength={2}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="時"
                    />
                    <span className="ml-1 text-gray-600">時</span>
                  </div>
                  {/* テキスト入力：分 */}
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={inputValues.minute}
                      onChange={(e) => handleInputChange('minute', e.target.value)}
                      placeholder="59"
                      maxLength={2}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="分"
                    />
                    <span className="ml-1 text-gray-600">分</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isCalculating}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCalculating ? '計算中...' : '計算する'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              クリア
            </button>
          </div>
        </form>

        {/* 計算結果 */}
        {result && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              計算結果
            </h3>

            {/* 入力した日時 */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">入力日時:</p>
              <p className="text-lg font-mono text-gray-800">
                {result.formattedDateTime}
                {result.isFuture && (
                  <span className="ml-2 text-sm text-orange-600 font-normal">
                    （未来の日時）
                  </span>
                )}
              </p>
            </div>

            {/* 回転数表示 */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2 text-center">
                地球の累積自転回数
              </p>
              <p className="text-3xl md:text-4xl font-bold text-blue-800 font-mono text-center">
                {formatRotation(result.rotationCount)} 回転
              </p>
            </div>

            {/* 表示形式切り替え */}
            <div className="mt-6">
              <DisplayFormatToggle />
            </div>

            {/* 計算基準の説明 */}
            <div className="text-xs text-gray-500 mt-4 text-center">
              <p>※ 計算基準: 西暦1年1月1日 00:00 UTC = 0回転</p>
              <p>※ 恒星日（23時間56分4秒）基準で計算</p>
            </div>
          </div>
        )}
      </div>

      {/* 使い方の説明 */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        <p>※ 日時はUTC（協定世界時）で入力してください</p>
        <p>※ 年は1〜9999の範囲で指定可能です</p>
      </div>
    </div>
  );
}

export default memo(DateTimeInput);
