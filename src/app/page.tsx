import Header from '@/components/Header';
import MainCounter from '@/components/MainCounter';
import TauntPanel from '@/components/TauntPanel';
import Footer from '@/components/Footer';

/**
 * メインページコンポーネント
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto max-w-4xl py-8">
          {/* メインカウンター */}
          <section className="mb-12">
            <MainCounter />
          </section>
          
          {/* 煽りフレーズパネル */}
          <section>
            <TauntPanel />
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}