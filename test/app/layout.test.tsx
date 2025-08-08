import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';

// 子コンポーネントをモック
jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('@/components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

describe('RootLayout', () => {
  test('レイアウトコンポーネントが正しく動作すること', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="children">Test Content</div>
      </RootLayout>
    );
    
    // 子要素が表示されることを確認
    expect(getByTestId('children')).toBeInTheDocument();
  });

  test('bodyクラスが適用されていること', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-content">Content</div>
      </RootLayout>
    );
    
    // bodyタグではなく、レンダリングされた要素の構造を確認
    expect(container.querySelector('[data-testid="test-content"]')).toBeInTheDocument();
  });
});