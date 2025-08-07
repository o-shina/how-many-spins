'use client';

import { memo } from 'react';

/**
 * アプリケーションのフッターコンポーネント
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>地球が何回回った時？</strong> - How Many Spins?
          </p>
          <p>
            子どもの煽りフレーズに即答するWebアプリケーション
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <span>© {currentYear} How Many Spins</span>
            <span>恒星日基準: 23時間56分4秒</span>
            <span>基準日時: 西暦1年1月1日 00:00 UTC</span>
          </div>
        </div>
        
        {/* 技術情報 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Made with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);