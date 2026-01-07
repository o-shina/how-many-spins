import Header from '@/components/Header';
import CounterContainer from '@/components/CounterContainer';
// import TauntPanel from '@/components/TauntPanel';
import Footer from '@/components/Footer';
import { DisplayFormatProvider } from '@/context/DisplayFormatContext';

/**
 * メインページコンポーネント
 */
export default function HomePage() {
  return (
    <DisplayFormatProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            {/* カウンターコンテナ（リアルタイム/時間指定切り替え） */}
            <section className="mb-12">
              <CounterContainer />
            </section>

            {/* 煽りフレーズパネル - 一旦非表示（今後改善予定） */}
            {/* <section>
              <TauntPanel />
            </section> */}
          </div>
        </main>

        <Footer />
      </div>
    </DisplayFormatProvider>
  );
}
