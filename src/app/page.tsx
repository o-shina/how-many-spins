import Header from '@/components/Header';
import MainCounter from '@/components/MainCounter';
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
          <div className="container mx-auto max-w-4xl py-8">
            {/* メインカウンター */}
            <section className="mb-12">
              <MainCounter />
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