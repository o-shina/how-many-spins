'use client';

import { useState, memo } from 'react';
import MainCounter from './MainCounter';
import DateTimeInput from './DateTimeInput';

type TabMode = 'realtime' | 'datetime';

/**
 * カウンター表示のコンテナコンポーネント
 * リアルタイムモードと日時指定モードを切り替え可能
 */
function CounterContainer() {
  const [mode, setMode] = useState<TabMode>('realtime');

  return (
    <div className="w-full">
      {/* タブ切り替えUI */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
          <button
            onClick={() => setMode('realtime')}
            className={`
              px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200
              ${mode === 'realtime'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
            type="button"
            aria-pressed={mode === 'realtime'}
            aria-label="リアルタイムモードに切り替え"
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              現在時刻
            </span>
          </button>
          <button
            onClick={() => setMode('datetime')}
            className={`
              px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200
              ${mode === 'datetime'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
            type="button"
            aria-pressed={mode === 'datetime'}
            aria-label="時間指定モードに切り替え"
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              時間指定
            </span>
          </button>
        </div>
      </div>

      {/* コンテンツ表示 */}
      <div className="w-full">
        {mode === 'realtime' ? (
          <MainCounter />
        ) : (
          <DateTimeInput />
        )}
      </div>
    </div>
  );
}

export default memo(CounterContainer);
