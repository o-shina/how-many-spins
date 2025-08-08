import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

// 子コンポーネントをモック
jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('@/components/MainCounter', () => {
  return function MockMainCounter() {
    return <div data-testid="main-counter">MainCounter</div>;
  };
});

jest.mock('@/components/TauntPanel', () => {
  return function MockTauntPanel() {
    return <div data-testid="taunt-panel">TauntPanel</div>;
  };
});

jest.mock('@/components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

describe('HomePage', () => {
  test('すべてのコンポーネントが正しく表示されること', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('main-counter')).toBeInTheDocument();
    expect(screen.getByTestId('taunt-panel')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('適切なレイアウト構造を持つこと', () => {
    const { container } = render(<HomePage />);
    
    // min-h-screen flex flex-col構造を確認
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('min-h-screen', 'flex', 'flex-col');
    
    // メインコンテンツがflex-growを持つことを確認
    const main = container.querySelector('main');
    expect(main).toHaveClass('flex-grow');
  });

  test('セクション要素が適切に配置されていること', () => {
    const { container } = render(<HomePage />);
    
    const sections = container.querySelectorAll('section');
    expect(sections).toHaveLength(2);
    
    // メインカウンターセクション
    expect(sections[0]).toHaveClass('mb-12');
    
    // タントパネルセクション（2つ目のセクション）
    expect(sections[1]).toBeInTheDocument();
  });

  test('コンテナの最大幅が設定されていること', () => {
    const { container } = render(<HomePage />);
    
    const containerDiv = container.querySelector('.container.mx-auto.max-w-4xl');
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('py-8');
  });
});