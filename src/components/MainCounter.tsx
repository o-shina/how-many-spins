'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { EarthRotationCalculator } from '@/lib/earth-rotation-calculator';
import { formatDateTime } from '@/lib/date-formatter';
import { EarthRotationData } from '@/types/earth-rotation';
import { useDisplayFormat } from '@/hooks/useDisplayFormat';
import DisplayFormatToggle from './DisplayFormatToggle';

/**
 * メインカウンター表示コンポーネント
 * 現在時刻と地球の回転数をリアルタイムで表示
 */
function MainCounter() {
  const [rotationData, setRotationData] = useState<EarthRotationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculator = useMemo(() => new EarthRotationCalculator(), []);
  const { formatRotation, isLoaded: formatLoaded } = useDisplayFormat();

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
    let animationFrameId: number;
    let lastUpdate = Date.now();

    // 初期データを即座に更新
    updateRotationData();

    // requestAnimationFrame で1秒ごとに更新
    const tick = () => {
      const now = Date.now();
      if (now - lastUpdate >= 1000) {
        updateRotationData();
        lastUpdate = now;
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [updateRotationData]);

  if (isLoading || !formatLoaded) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-sky-500 mb-4"></div>
        <p className="text-slate-600">計算中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-rose-600">
        <p className="text-lg mb-4">{error}</p>
        <button 
          onClick={updateRotationData}
          className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          再試行
        </button>
      </div>
    );
  }

  if (!rotationData) {
    return (
      <div className="text-center py-12 text-slate-600">
        <p>データを読み込めませんでした</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8 md:py-12">
      <div className="grid gap-6">
        {/* 現在時刻表示 */}
        <div className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Current Time (UTC)
          </p>
          <h2 className="mt-3 text-lg font-semibold text-slate-700 md:text-xl">
            現在時刻
          </h2>
          <p className="mt-2 text-xl font-mono text-slate-900 md:text-2xl">
            {rotationData.formattedDateTime}
          </p>
        </div>

        {/* 地球回転数表示 */}
        <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Earth Rotation Counter
          </p>
          <h2 className="mt-3 text-lg font-semibold text-slate-700 md:text-xl">
            地球の累積自転回数
          </h2>
          <p className="mt-4 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600 font-mono md:text-5xl lg:text-6xl animate-counter">
            {formatRotation(rotationData.rotationCount)} 回転
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              リアルタイム更新中
            </span>
            <span>恒星日基準で計算</span>
          </div>
        </div>
      </div>

      {/* 表示形式切り替えトグル */}
      <div className="mt-6">
        <DisplayFormatToggle />
      </div>

      {/* 計算基準の説明 */}
      <div className="mt-6 text-xs text-slate-500">
        <p>※ 計算基準: 西暦1年1月1日 00:00 UTC = 0回転</p>
        <p>※ 恒星日（23時間56分4秒）基準で計算</p>
      </div>
    </div>
  );
}

export default memo(MainCounter);
