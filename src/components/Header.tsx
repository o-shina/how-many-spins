'use client';

import { memo } from 'react';

/**
 * アプリケーションのヘッダーコンポーネント
 */
function Header() {
  return (
    <header className="border-b border-white/70 bg-white/70 backdrop-blur">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
            Live Counter
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            地球が何回回った時？
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 md:text-base">
            How Many Spins? - 煽りフレーズに即答するための地球回転カウンター
          </p>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
