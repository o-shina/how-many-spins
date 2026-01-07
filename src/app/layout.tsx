import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';
import '@/app/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '地球が何回回った時？ | How Many Spins?',
  description: '子どもの煽りフレーズ「いつ？何年何月何日何曜日？何時何分何秒？地球が何回回ったとき？」に即座に答えるWebアプリケーション',
  keywords: '地球, 自転, 回転数, 煽り, フレーズ, 時間, 計算, リアルタイム',
  authors: [{ name: 'How Many Spins Team' }],
  robots: 'index, follow',
  openGraph: {
    title: '地球が何回回った時？ | How Many Spins?',
    description: '子どもの煽りフレーズに即座に答えるWebアプリ',
    type: 'website',
    locale: 'ja_JP',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${spaceGrotesk.variable} ${plexMono.variable} min-h-screen bg-slate-50 font-sans text-slate-900 antialiased`}
      >
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-200/30 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%)]" />
        </div>
        {children}
      </body>
    </html>
  );
}
