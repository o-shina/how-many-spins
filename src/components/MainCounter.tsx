'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { EarthRotationCalculator } from '@/lib/earth-rotation-calculator';
import { formatDateTime } from '@/lib/date-formatter';
import { EarthRotationData } from '@/types/earth-rotation';

/**
 * メインカウンター表示コンポーネント
 * 現在時刻と地球の回転数をリアルタイムで表示
 */
export default function MainCounter() {
  const [rotationData, setRotationData] = useState<EarthRotationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculator = useMemo(() => new EarthRotationCalculator(), []);

  /**
   * 回転データを更新する
   */
  const updateRotationData = useCallback(() => {
    try {
      const now = new Date();
      const rotations = calculator.calculateRotationsFromDate(now);
      const formattedRotations = calculator.formatRotations(rotations);
      const formattedDateTime = formatDateTime(now);

      const newData: EarthRotationData = {
        currentDateTime: now,
        rotationCount: rotations,
        formattedRotations,
        formattedDateTime,
        calculationBasis: 'UTC'
      };

      setRotationData(newData);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      setError('計算中にエラーが発生しました');
      setIsLoading(false);
      console.error('回転数計算エラー:', err);
    }
  }, [calculator]);

  // 初期データ読み込みとリアルタイム更新
  useEffect(() => {
    // 初期データを即座に更新
    updateRotationData();

    // 1秒間隔でリアルタイム更新
    const interval = setInterval(() => {
      updateRotationData();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateRotationData]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">計算中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-lg mb-4">{error}</p>
        <button 
          onClick={updateRotationData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          再試行
        </button>
      </div>
    );
  }

  if (!rotationData) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>データを読み込めませんでした</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8 md:py-12">
      {/* 現在時刻表示 */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
          現在時刻
        </h2>
        <p className="text-xl md:text-2xl font-mono text-gray-800">
          {rotationData.formattedDateTime}
        </p>
      </div>

      {/* 地球回転数表示 */}
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
          地球の累積自転回数
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 md:p-8 mx-4">
          <p className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-800 font-mono mb-2">
            {rotationData.formattedRotations}
          </p>
        </div>
      </div>

      {/* 計算基準の説明 */}
      <div className="text-sm text-gray-500 mt-4">
        <p>※ 計算基準: 西暦1年1月1日 00:00 UTC = 0回転</p>
        <p>※ 恒星日（23時間56分4秒）基準で計算</p>
      </div>

      {/* リアルタイム更新インジケーター */}
      <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
        <span>リアルタイム更新中</span>
      </div>
    </div>
  );
}