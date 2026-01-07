'use client';

import { memo } from 'react';

/**
 * アプリケーションのフッターコンポーネント
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-white/70 bg-white/70 py-6 backdrop-blur">
      <div className="container mx-auto px-4 text-center">
        <div className="space-y-2 text-sm text-slate-600">
          <p>
            <strong>地球が何回回った時？</strong> - How Many Spins?
          </p>
          <p>
            子どもの煽りフレーズに即答するWebアプリケーション
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <span>© {currentYear} How Many Spins</span>
            <span>恒星日基準: 23時間56分4秒</span>
            <span>基準日時: 西暦1年1月1日 00:00 UTC</span>
          </div>
        </div>
        
        {/* 技術情報 */}
        <div className="mt-4 pt-4 border-t border-white/70">
          <p className="text-xs text-slate-500">
            Made with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
