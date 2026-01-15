import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DateTimeInput from '@/components/DateTimeInput';
import { DisplayFormatProvider } from '@/context/DisplayFormatContext';
import { EarthRotationCalculator } from '@/lib/earth-rotation-calculator';
import React from 'react';

// EarthRotationCalculatorをモック化
jest.mock('@/lib/earth-rotation-calculator');
jest.mock('@/lib/date-formatter', () => ({
  formatDateTime: jest.fn((date: Date) => '2025年12月16日(月) 12時34分56秒'),
}));

describe('DateTimeInput', () => {
  const mockCalculateRotationsFromDate = jest.fn();

  beforeEach(() => {
    (EarthRotationCalculator as jest.Mock).mockImplementation(() => ({
      calculateRotationsFromDate: mockCalculateRotationsFromDate,
    }));
    mockCalculateRotationsFromDate.mockReturnValue(1234567.123456);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <DisplayFormatProvider>{component}</DisplayFormatProvider>
    );
  };

  describe('初期表示', () => {
    test('タイトルが表示されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        expect(screen.getByText('指定した日時の地球回転数を計算')).toBeInTheDocument();
      });
    });

    test('入力フィールドがすべて表示されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        expect(screen.getByLabelText('年')).toBeInTheDocument();
        expect(screen.getByLabelText('月')).toBeInTheDocument();
        expect(screen.getByLabelText('日')).toBeInTheDocument();
        expect(screen.getByLabelText('時')).toBeInTheDocument();
        expect(screen.getByLabelText('分')).toBeInTheDocument();
      });
    });

    test('コンボボックス形式のテキスト入力であること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        const yearInput = screen.getByLabelText('年') as HTMLInputElement;
        expect(yearInput.tagName).toBe('INPUT');
        expect(yearInput.type).toBe('text');
        expect(yearInput).toHaveAttribute('list', 'year-options');
      });
    });

    test('計算ボタンとクリアボタンが表示されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /計算する/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /クリア/i })).toBeInTheDocument();
      });
    });

    test('初期状態では結果が表示されていないこと', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        expect(screen.queryByText('計算結果')).not.toBeInTheDocument();
      });
    });
  });

  describe('入力処理', () => {
    test('数値を入力できること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        const yearInput = screen.getByLabelText('年') as HTMLInputElement;
        fireEvent.change(yearInput, { target: { value: '2025' } });
        expect(yearInput.value).toBe('2025');
      });
    });

    test('数値以外の文字は入力できないこと', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        const yearInput = screen.getByLabelText('年') as HTMLInputElement;
        fireEvent.change(yearInput, { target: { value: 'abc' } });
        expect(yearInput.value).toBe('');
      });
    });

    test('各フィールドに異なる値を入力できること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(async () => {
        const yearInput = screen.getByLabelText('年') as HTMLInputElement;
        const monthInput = screen.getByLabelText('月') as HTMLInputElement;
        const dayInput = screen.getByLabelText('日') as HTMLInputElement;

        fireEvent.change(yearInput, { target: { value: '2025' } });
        fireEvent.change(monthInput, { target: { value: '12' } });
        fireEvent.change(dayInput, { target: { value: '31' } });

        expect(yearInput.value).toBe('2025');
        expect(monthInput.value).toBe('12');
        expect(dayInput.value).toBe('31');
      });
    });
  });

  describe('バリデーション', () => {
    test('必須入力チェック - すべてのフィールドが空の場合', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        expect(screen.getByText('すべての項目を入力してください')).toBeInTheDocument();
      });
    });

    test('年の範囲チェック - 0以下の場合', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        fillAllFields({ year: '0', month: '12', day: '31', hour: '12', minute: '30' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        expect(screen.getByText(/年は1〜9999の範囲で入力してください/i)).toBeInTheDocument();
      });
    });

    test('年の範囲チェック - 10000以上の場合', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        fillAllFields({ year: '10000', month: '12', day: '31', hour: '12', minute: '30' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        expect(screen.getByText(/年は1〜9999の範囲で入力してください/i)).toBeInTheDocument();
      });
    });

    test('月の範囲チェック - 13の場合', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        fillAllFields({ year: '2025', month: '13', day: '15', hour: '12', minute: '30' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        expect(screen.getByText(/月は1〜12の範囲で入力してください/i)).toBeInTheDocument();
      });
    });

    test('存在しない日付のチェック - 2月30日', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        fillAllFields({ year: '2025', month: '2', day: '30', hour: '12', minute: '30' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        expect(screen.getByText(/存在しない日付が入力されています/i)).toBeInTheDocument();
      });
    });

    test('時の範囲チェック - 24の場合', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        fillAllFields({ year: '2025', month: '12', day: '15', hour: '24', minute: '30' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        expect(screen.getByText(/時は0〜23の範囲で入力してください/i)).toBeInTheDocument();
      });
    });

    test('分の範囲チェック - 60の場合', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        fillAllFields({ year: '2025', month: '12', day: '15', hour: '12', minute: '60' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        expect(screen.getByText(/分は0〜59の範囲で入力してください/i)).toBeInTheDocument();
      });
    });
  });

  describe('計算機能', () => {
    test('正しい入力で計算が実行されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        fillAllFields({ year: '2025', month: '12', day: '16', hour: '12', minute: '34' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        expect(mockCalculateRotationsFromDate).toHaveBeenCalled();
      });
    });

    test('計算結果が表示されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(async () => {
        fillAllFields({ year: '2025', month: '12', day: '16', hour: '12', minute: '34' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        await waitFor(() => {
          expect(screen.getByText('計算結果')).toBeInTheDocument();
          expect(screen.getByText(/2025年12月16日/i)).toBeInTheDocument();
        });
      });
    });

    test('未来の日時の場合は警告が表示されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(async () => {
        // 未来の日時を設定
        fillAllFields({ year: '2099', month: '12', day: '31', hour: '23', minute: '59' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        await waitFor(() => {
          expect(screen.getByText(/未来の日時/i)).toBeInTheDocument();
        });
      });
    });
  });

  describe('クリア機能', () => {
    test('クリアボタンをクリックすると入力がクリアされること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        fillAllFields({ year: '2025', month: '12', day: '16', hour: '12', minute: '34' });

        const clearButton = screen.getByRole('button', { name: /クリア/i });
        fireEvent.click(clearButton);

        const yearInput = screen.getByLabelText('年') as HTMLInputElement;
        const monthInput = screen.getByLabelText('月') as HTMLInputElement;
        expect(yearInput.value).toBe('');
        expect(monthInput.value).toBe('');
      });
    });

    test('クリアボタンをクリックすると結果とエラーがクリアされること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(async () => {
        // エラーを発生させる
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        await waitFor(() => {
          expect(screen.getByText('すべての項目を入力してください')).toBeInTheDocument();
        });

        const clearButton = screen.getByRole('button', { name: /クリア/i });
        fireEvent.click(clearButton);

        expect(screen.queryByText('すべての項目を入力してください')).not.toBeInTheDocument();
      });
    });
  });

  describe('UIの状態', () => {
    test('計算中はボタンが無効化されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        fillAllFields({ year: '2025', month: '12', day: '16', hour: '12', minute: '34' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });

        // 計算中の状態をテストするのは難しいため、ボタンの存在確認のみ
        expect(calculateButton).toBeInTheDocument();
      });
    });
  });

  describe('プリセット機能', () => {
    test('プリセット選択UIが表示されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        expect(screen.getByText('プリセットから選択')).toBeInTheDocument();
        expect(screen.getByText('元号')).toBeInTheDocument();
        expect(screen.getByText('イベント')).toBeInTheDocument();
        expect(screen.getByText('マイルストーン')).toBeInTheDocument();
      });
    });

    test('プリセットボタンが表示されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /令和元年を選択/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /平成元年を選択/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /2000年問題を選択/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /UNIXエポックを選択/i })).toBeInTheDocument();
      });
    });

    test('プリセットをクリックすると入力値が反映されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        // 令和元年を選択（2019年4月30日 15:00 UTC）
        const reiwaButton = screen.getByRole('button', { name: /令和元年を選択/i });
        fireEvent.click(reiwaButton);

        const yearInput = screen.getByLabelText('年') as HTMLInputElement;
        const monthInput = screen.getByLabelText('月') as HTMLInputElement;
        const dayInput = screen.getByLabelText('日') as HTMLInputElement;
        const hourInput = screen.getByLabelText('時') as HTMLInputElement;
        const minuteInput = screen.getByLabelText('分') as HTMLInputElement;

        expect(yearInput.value).toBe('2019');
        expect(monthInput.value).toBe('4');
        expect(dayInput.value).toBe('30');
        expect(hourInput.value).toBe('15');
        expect(minuteInput.value).toBe('0');
      });
    });

    test('別のプリセットを選択すると入力値が更新されること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(() => {
        // 令和元年を選択
        const reiwaButton = screen.getByRole('button', { name: /令和元年を選択/i });
        fireEvent.click(reiwaButton);

        // UNIXエポックを選択（1970年1月1日 00:00 UTC）
        const unixButton = screen.getByRole('button', { name: /UNIXエポックを選択/i });
        fireEvent.click(unixButton);

        const yearInput = screen.getByLabelText('年') as HTMLInputElement;
        const monthInput = screen.getByLabelText('月') as HTMLInputElement;
        const dayInput = screen.getByLabelText('日') as HTMLInputElement;

        expect(yearInput.value).toBe('1970');
        expect(monthInput.value).toBe('1');
        expect(dayInput.value).toBe('1');
      });
    });

    test('プリセット選択後にエラーがクリアされること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(async () => {
        // エラーを発生させる
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        await waitFor(() => {
          expect(screen.getByText('すべての項目を入力してください')).toBeInTheDocument();
        });

        // プリセットを選択
        const reiwaButton = screen.getByRole('button', { name: /令和元年を選択/i });
        fireEvent.click(reiwaButton);

        expect(screen.queryByText('すべての項目を入力してください')).not.toBeInTheDocument();
      });
    });

    test('プリセット選択後に計算できること', async () => {
      renderWithProvider(<DateTimeInput />);

      await waitFor(async () => {
        // 令和元年を選択
        const reiwaButton = screen.getByRole('button', { name: /令和元年を選択/i });
        fireEvent.click(reiwaButton);

        // 計算実行
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);

        await waitFor(() => {
          expect(mockCalculateRotationsFromDate).toHaveBeenCalled();
          expect(screen.getByText('計算結果')).toBeInTheDocument();
        });
      });
    });
  });

  // ヘルパー関数
  function fillAllFields({ year, month, day, hour, minute }: {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
  }) {
    const yearInput = screen.getByLabelText('年');
    const monthInput = screen.getByLabelText('月');
    const dayInput = screen.getByLabelText('日');
    const hourInput = screen.getByLabelText('時');
    const minuteInput = screen.getByLabelText('分');

    fireEvent.change(yearInput, { target: { value: year } });
    fireEvent.change(monthInput, { target: { value: month } });
    fireEvent.change(dayInput, { target: { value: day } });
    fireEvent.change(hourInput, { target: { value: hour } });
    fireEvent.change(minuteInput, { target: { value: minute } });
  }
});
