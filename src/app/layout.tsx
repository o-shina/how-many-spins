import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: '地球が何回回った時？ | How Many Spins?',
  description: '子どもの煽りフレーズ「いつ？何年何月何日何曜日？何時何分何秒？地球が何回回ったとき？」に即座に答えるWebアプリケーション',
  keywords: '地球, 自転, 回転数, 煽り, フレーズ, 時間, 計算, リアルタイム',
  authors: [{ name: 'How Many Spins Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: '地球が何回回った時？ | How Many Spins?',
    description: '子どもの煽りフレーズに即座に答えるWebアプリ',
    type: 'website',
    locale: 'ja_JP',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}