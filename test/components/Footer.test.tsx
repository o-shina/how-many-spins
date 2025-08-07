import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  test('フッターが正しく表示されること', () => {
    render(<Footer />);
    
    expect(screen.getByText('地球が何回回った時？')).toBeInTheDocument();
    expect(screen.getByText('- How Many Spins?')).toBeInTheDocument();
    expect(screen.getByText('子どもの煽りフレーズに即答するWebアプリケーション')).toBeInTheDocument();
  });

  test('適切なCSSクラスが適用されていること', () => {
    const { container } = render(<Footer />);
    const footer = container.firstChild as HTMLElement;
    
    expect(footer).toHaveClass('bg-gray-50', 'border-t', 'border-gray-200', 'py-6');
  });

  test('コピーライト年が正しく表示されること', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  test('技術情報が表示されること', () => {
    render(<Footer />);
    
    expect(screen.getByText('恒星日基準: 23時間56分4秒')).toBeInTheDocument();
    expect(screen.getByText('基準日時: 西暦1年1月1日 00:00 UTC')).toBeInTheDocument();
    expect(screen.getByText('Made with Next.js, TypeScript, and Tailwind CSS')).toBeInTheDocument();
  });
});