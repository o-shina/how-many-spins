import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header', () => {
  test('ヘッダーが正しく表示されること', () => {
    render(<Header />);
    
    expect(screen.getByText('地球が何回回った時？')).toBeInTheDocument();
    expect(screen.getByText('How Many Spins? - 煽りフレーズに即答するWebアプリ')).toBeInTheDocument();
  });

  test('適切な見出しレベルが使用されていること', () => {
    render(<Header />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('地球が何回回った時？');
  });

  test('適切なCSSクラスが適用されていること', () => {
    const { container } = render(<Header />);
    const header = container.firstChild as HTMLElement;
    
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b', 'border-gray-200', 'py-4');
  });

  test('レスポンシブデザインクラスが適用されていること', () => {
    render(<Header />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveClass('text-2xl', 'md:text-4xl', 'font-bold');
  });
});