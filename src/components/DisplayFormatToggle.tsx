'use client';

import { memo } from 'react';
import { useDisplayFormat } from '@/hooks/useDisplayFormat';

/**
 * 回転数表示形式の切り替えトグルボタン
 */
function DisplayFormatToggle() {
  const { isLoaded, toggleFormat, isInteger } = useDisplayFormat();

  // ローカルストレージから設定を読み込み中は何も表示しない
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          表示形式
        </span>
        <button
          onClick={toggleFormat}
          className={`
            relative inline-flex h-8 w-16 items-center rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-transparent
            ${isInteger 
              ? 'bg-slate-900 border-slate-900' 
              : 'bg-white/70 border-slate-300'
            }
          `}
          type="button"
          role="switch"
          aria-checked={isInteger}
          aria-label={`回転数表示形式を${isInteger ? '小数' : '整数'}に変更`}
        >
          {/* トグルスライダー */}
          <span
            className={`
              inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out
              ${isInteger ? 'translate-x-1' : 'translate-x-8'}
            `}
          />
        </button>
        <div className="flex flex-col text-xs">
          <span className={`font-semibold ${isInteger ? 'text-slate-900' : 'text-slate-400'}`}>
            整数
          </span>
          <span className={`font-semibold ${!isInteger ? 'text-slate-900' : 'text-slate-400'}`}>
            小数
          </span>
        </div>
      </div>
      
      {/* 説明テキスト */}
      <div className="ml-4 text-xs text-slate-500">
        {isInteger ? '整数表示（切り捨て）' : '小数表示（6桁精度）'}
      </div>
    </div>
  );
}

export default memo(DisplayFormatToggle);
