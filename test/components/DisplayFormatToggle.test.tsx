import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DisplayFormatToggle from '@/components/DisplayFormatToggle';

// useDisplayFormatフックをモック化
const mockToggleFormat = jest.fn();
const mockUseDisplayFormat = {
  format: 'integer' as const,
  isLoaded: true,
  toggleFormat: mockToggleFormat,
  isInteger: true,
  isDecimal: false,
  formatRotation: jest.fn((n: number) => Math.floor(n).toLocaleString('ja-JP')),
};

jest.mock('@/hooks/useDisplayFormat', () => ({
  useDisplayFormat: jest.fn(() => mockUseDisplayFormat),
}));

describe('DisplayFormatToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // デフォルトの状態をリセット
    mockUseDisplayFormat.format = 'integer';
    mockUseDisplayFormat.isInteger = true;
    mockUseDisplayFormat.isDecimal = false;
    mockUseDisplayFormat.isLoaded = true;
  });

  test('整数表示モードで正しく表示されること', () => {
    render(<DisplayFormatToggle />);
    
    expect(screen.getByText('表示形式:')).toBeInTheDocument();
    expect(screen.getByText('整数')).toBeInTheDocument();
    expect(screen.getByText('小数')).toBeInTheDocument();
    expect(screen.getByText('整数表示（切り捨て）')).toBeInTheDocument();
    
    const toggleButton = screen.getByRole('switch');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-checked', 'true');
    expect(toggleButton).toHaveAttribute('aria-label', '回転数表示形式を小数に変更');
  });

  test('小数表示モードで正しく表示されること', () => {
    // 小数表示モードに設定
    mockUseDisplayFormat.format = 'decimal';
    mockUseDisplayFormat.isInteger = false;
    mockUseDisplayFormat.isDecimal = true;
    
    render(<DisplayFormatToggle />);
    
    expect(screen.getByText('小数表示（6桁精度）')).toBeInTheDocument();
    
    const toggleButton = screen.getByRole('switch');
    expect(toggleButton).toHaveAttribute('aria-checked', 'false');
    expect(toggleButton).toHaveAttribute('aria-label', '回転数表示形式を整数に変更');
  });

  test('トグルボタンをクリックで表示形式が切り替わること', async () => {
    const user = userEvent.setup();
    render(<DisplayFormatToggle />);
    
    const toggleButton = screen.getByRole('switch');
    await user.click(toggleButton);
    
    expect(mockToggleFormat).toHaveBeenCalledTimes(1);
  });

  test('ローディング中は何も表示されないこと', () => {
    mockUseDisplayFormat.isLoaded = false;
    
    const { container } = render(<DisplayFormatToggle />);
    
    expect(container.firstChild).toBeNull();
  });

  test('適切なCSSクラスが適用されていること', () => {
    render(<DisplayFormatToggle />);
    
    const toggleButton = screen.getByRole('switch');
    expect(toggleButton).toHaveClass('bg-blue-600', 'border-blue-600');
    
    const integerLabel = screen.getByText('整数');
    expect(integerLabel).toHaveClass('text-blue-600');
    
    const decimalLabel = screen.getByText('小数');
    expect(decimalLabel).toHaveClass('text-gray-400');
  });

  test('小数モード時に適切なCSSクラスが適用されていること', () => {
    mockUseDisplayFormat.format = 'decimal';
    mockUseDisplayFormat.isInteger = false;
    mockUseDisplayFormat.isDecimal = true;
    
    render(<DisplayFormatToggle />);
    
    const toggleButton = screen.getByRole('switch');
    expect(toggleButton).toHaveClass('bg-gray-200', 'border-gray-300');
    
    const integerLabel = screen.getByText('整数');
    expect(integerLabel).toHaveClass('text-gray-400');
    
    const decimalLabel = screen.getByText('小数');
    expect(decimalLabel).toHaveClass('text-blue-600');
  });
});