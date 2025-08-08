'use client';

import { memo } from 'react';

/**
 * アプリケーションのヘッダーコンポーネント
 */
function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            地球が何回回った時？
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            How Many Spins? - 煽りフレーズに即答するWebアプリ
          </p>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);