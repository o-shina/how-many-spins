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
    <div className="flex items-center justify-center mb-4">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-600">表示形式:</span>
        <button
          onClick={toggleFormat}
          className={`
            relative inline-flex h-8 w-16 items-center rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${isInteger 
              ? 'bg-blue-600 border-blue-600' 
              : 'bg-gray-200 border-gray-300'
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
          <span className={`font-medium ${isInteger ? 'text-blue-600' : 'text-gray-400'}`}>
            整数
          </span>
          <span className={`font-medium ${!isInteger ? 'text-blue-600' : 'text-gray-400'}`}>
            小数
          </span>
        </div>
      </div>
      
      {/* 説明テキスト */}
      <div className="ml-4 text-xs text-gray-500">
        {isInteger ? '整数表示（切り捨て）' : '小数表示（6桁精度）'}
      </div>
    </div>
  );
}

export default memo(DisplayFormatToggle);