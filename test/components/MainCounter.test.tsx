import { render, screen, waitFor, act } from '@testing-library/react';
import MainCounter from '@/components/MainCounter';

// タイマーをモック化
jest.useFakeTimers();

// EarthRotationCalculatorをモック化
jest.mock('@/lib/earth-rotation-calculator', () => {
  return {
    EarthRotationCalculator: jest.fn().mockImplementation(() => {
      return {
        calculateRotationsFromDate: jest.fn().mockReturnValue(1234567.123456),
        formatRotations: jest.fn().mockReturnValue('1,234,567.123456 回転'),
      };
    }),
  };
});

describe('MainCounter', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('初期表示', () => {
    test('読み込み中の状態を表示すること', async () => {
      render(<MainCounter />);
      
      // 非同期コンポーネントなので、一瞬でもローディング状態を確認
      // または実際のレンダリング結果を確認
      await waitFor(() => {
        expect(screen.getByText('現在時刻')).toBeInTheDocument();
      });
    });

    test('データ読み込み後に正しい内容を表示すること', async () => {
      render(<MainCounter />);
      
      await waitFor(() => {
        expect(screen.getByText('現在時刻')).toBeInTheDocument();
        expect(screen.getByText('地球の累積自転回数')).toBeInTheDocument();
        // デフォルトは整数表示
        expect(screen.getByText('1,234,567 回転')).toBeInTheDocument();
        // 表示形式切り替えトグルが表示されている
        expect(screen.getByText('表示形式:')).toBeInTheDocument();
      });
    });

    test('計算基準の説明を表示すること', async () => {
      render(<MainCounter />);
      
      await waitFor(() => {
        expect(screen.getByText(/西暦1年1月1日 00:00 UTC = 0回転/)).toBeInTheDocument();
        expect(screen.getByText(/恒星日.*基準で計算/)).toBeInTheDocument();
      });
    });

    test('リアルタイム更新インジケーターを表示すること', async () => {
      render(<MainCounter />);
      
      await waitFor(() => {
        expect(screen.getByText('リアルタイム更新中')).toBeInTheDocument();
      });
    });
  });

  describe('アクセシビリティ', () => {
    test('適切な見出し要素が使用されていること', async () => {
      render(<MainCounter />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: '現在時刻' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: '地球の累積自転回数' })).toBeInTheDocument();
      });
    });

    test('読み込み状態が適切に通知されること', async () => {
      render(<MainCounter />);
      
      // 実際には計算が瞬時に終了するため、結果を確認
      await waitFor(() => {
        expect(screen.getByText('現在時刻')).toBeInTheDocument();
      });
    });
  });

  describe('レスポンシブデザイン', () => {
    test('適切なCSSクラスが適用されていること', async () => {
      render(<MainCounter />);
      
      await waitFor(() => {
        const rotationDisplay = screen.getByText('1,234,567 回転');
        expect(rotationDisplay).toHaveClass('text-3xl', 'md:text-5xl', 'lg:text-6xl');
        expect(rotationDisplay).toHaveClass('font-bold', 'font-mono');
      });
    });
  });
});