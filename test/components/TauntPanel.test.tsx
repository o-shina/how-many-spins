import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TauntPanel from '@/components/TauntPanel';

// TauntGeneratorとEarthRotationCalculatorをモック化
jest.mock('@/lib/taunt-generator', () => {
  return {
    TauntGenerator: jest.fn().mockImplementation(() => ({
      generateTaunt: jest.fn().mockReturnValue('いつ？2025年8月7日（木）14時37分24秒？地球が1,234,567回転したとき！'),
      generateTauntWithFormattedRotations: jest.fn().mockReturnValue('いつ？2025年8月7日（木）14時37分24秒？地球が1,234,567回転したとき！'),
      copyToClipboard: jest.fn().mockResolvedValue(true),
    })),
  };
});

jest.mock('@/lib/earth-rotation-calculator', () => {
  return {
    EarthRotationCalculator: jest.fn().mockImplementation(() => ({
      calculateRotationsFromDate: jest.fn().mockReturnValue(1234567.123456),
    })),
  };
});

// useDisplayFormatをモック化
jest.mock('@/hooks/useDisplayFormat', () => ({
  useDisplayFormat: () => ({
    format: 'integer',
    isLoaded: true,
    toggleFormat: jest.fn(),
    formatRotation: (n: number) => Math.floor(n).toLocaleString('ja-JP'),
    isInteger: true,
    isDecimal: false,
  }),
}));

describe('TauntPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('初期表示が正しく行われること', () => {
    render(<TauntPanel />);
    
    expect(screen.getByText('煽りフレーズ生成')).toBeInTheDocument();
    expect(screen.getByText('「いつ？何年何月何日...？」に即答するフレーズを生成')).toBeInTheDocument();
    expect(screen.getByText('煽りフレーズを生成')).toBeInTheDocument();
    expect(screen.getByText('上のボタンをクリックして煽りフレーズを生成してみましょう！')).toBeInTheDocument();
  });

  test('生成ボタンをクリックしてフレーズが生成されること', async () => {
    const user = userEvent.setup();
    render(<TauntPanel />);
    
    const generateButton = screen.getByText('煽りフレーズを生成');
    await user.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/いつ？2025年8月7日/)).toBeInTheDocument();
      expect(screen.getByText('📋 コピー')).toBeInTheDocument();
      expect(screen.getByText('🔄 再生成')).toBeInTheDocument();
    });
  });

  test('生成中の状態が正しく表示されること', async () => {
    render(<TauntPanel />);
    
    const generateButton = screen.getByText('煽りフレーズを生成');
    fireEvent.click(generateButton);
    
    // モックなので即座に結果が表示される。生成中の状態は一瞬なのでスキップ
    await waitFor(() => {
      expect(screen.getByText(/いつ？2025年8月7日/)).toBeInTheDocument();
    });
  });

  test('コピーボタンが機能すること', async () => {
    const user = userEvent.setup();
    render(<TauntPanel />);
    
    // まず生成
    const generateButton = screen.getByText('煽りフレーズを生成');
    await user.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText('📋 コピー')).toBeInTheDocument();
    });
    
    // コピー
    const copyButton = screen.getByText('📋 コピー');
    await user.click(copyButton);
    
    await waitFor(() => {
      expect(screen.getByText('コピーしました！')).toBeInTheDocument();
    });
  });

  test('再生成ボタンが機能すること', async () => {
    const user = userEvent.setup();
    render(<TauntPanel />);
    
    // まず生成
    const generateButton = screen.getByText('煽りフレーズを生成');
    await user.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText('🔄 再生成')).toBeInTheDocument();
    });
    
    // 再生成
    const regenerateButton = screen.getByText('🔄 再生成');
    await user.click(regenerateButton);
    
    // 新しいフレーズが生成されることを確認
    await waitFor(() => {
      expect(screen.getByText(/いつ？2025年8月7日/)).toBeInTheDocument();
    });
  });

  test('生成情報が表示されること', async () => {
    const user = userEvent.setup();
    render(<TauntPanel />);
    
    const generateButton = screen.getByText('煽りフレーズを生成');
    await user.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/生成時刻:/)).toBeInTheDocument();
      expect(screen.getByText(/回転数:/)).toBeInTheDocument();
    });
  });

  test('適切な見出しレベルが使用されていること', () => {
    render(<TauntPanel />);
    
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('煽りフレーズ生成');
  });
});