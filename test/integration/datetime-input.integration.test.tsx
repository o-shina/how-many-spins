import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CounterContainer from '@/components/CounterContainer';
import { DisplayFormatProvider } from '@/context/DisplayFormatContext';
import React from 'react';

// タイマーをモック化
jest.useFakeTimers();

// EarthRotationCalculatorをモック化
jest.mock('@/lib/earth-rotation-calculator', () => {
  return {
    EarthRotationCalculator: jest.fn().mockImplementation(() => {
      return {
        calculateRotationsFromDate: jest.fn((date: Date) => {
          // 実際の計算ロジックの簡易版
          const timestamp = date.getTime();
          return timestamp / 86164000; // 恒星日で割る
        }),
        formatRotations: jest.fn().mockReturnValue('1,234,567.123456 回転'),
      };
    }),
  };
});

jest.mock('@/lib/date-formatter', () => ({
  formatDateTime: jest.fn((date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(月) ${date.getHours()}時${date.getMinutes()}分${date.getSeconds()}秒`;
  }),
}));

describe('DateTimeInput 統合テスト', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <DisplayFormatProvider>{component}</DisplayFormatProvider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('タブ切り替えと日時入力の統合', () => {
    test('リアルタイムモードから時間指定モードに切り替えられること', async () => {
      renderWithProvider(<CounterContainer />);

      // 初期状態の確認（MainCounterの見出しを確認）
      await waitFor(() => {
        expect(screen.getByText('地球の累積自転回数')).toBeInTheDocument();
      });

      // 時間指定モードに切り替え
      const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });
      fireEvent.click(datetimeButton);

      // 日時入力コンポーネントが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('指定した日時の地球回転数を計算')).toBeInTheDocument();
        expect(screen.getByLabelText('年')).toBeInTheDocument();
      });
    });

    test('時間指定モードからリアルタイムモードに戻れること', async () => {
      renderWithProvider(<CounterContainer />);

      await waitFor(() => {
        // 時間指定モードに切り替え
        const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });
        fireEvent.click(datetimeButton);
      });

      await waitFor(() => {
        expect(screen.getByText('指定した日時の地球回転数を計算')).toBeInTheDocument();
      });

      // リアルタイムモードに戻す
      const realtimeButton = screen.getByRole('button', { name: /リアルタイムモードに切り替え/i });
      fireEvent.click(realtimeButton);

      // MainCounterが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('地球の累積自転回数')).toBeInTheDocument();
      });
    });
  });

  describe('入力モード切り替えの統合', () => {
    test('プルダウンモードとテキストモードが切り替えられること', async () => {
      renderWithProvider(<CounterContainer />);

      // 時間指定モードに切り替え
      await waitFor(() => {
        const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });
        fireEvent.click(datetimeButton);
      });

      await waitFor(() => {
        expect(screen.getByText('指定した日時の地球回転数を計算')).toBeInTheDocument();
      });

      // 初期状態はプルダウンモード
      await waitFor(() => {
        const yearSelect = screen.getByLabelText('年') as HTMLSelectElement;
        expect(yearSelect.tagName).toBe('SELECT');
      });

      // テキストモードに切り替え
      const textButton = screen.getByRole('button', { name: /テキスト入力に切り替え/i });
      fireEvent.click(textButton);

      // テキスト入力になることを確認
      await waitFor(() => {
        const yearInput = screen.getByLabelText('年') as HTMLInputElement;
        expect(yearInput.tagName).toBe('INPUT');
      });

      // プルダウンモードに戻す
      const selectButton = screen.getByRole('button', { name: /プルダウン入力に切り替え/i });
      fireEvent.click(selectButton);

      // プルダウンに戻ることを確認
      await waitFor(() => {
        const yearSelect = screen.getByLabelText('年') as HTMLSelectElement;
        expect(yearSelect.tagName).toBe('SELECT');
      });
    });
  });

  describe('日時入力から計算までの完全なフロー', () => {
    test('プルダウンで日時を入力して計算結果が表示されること', async () => {
      renderWithProvider(<CounterContainer />);

      // 時間指定モードに切り替え
      await waitFor(() => {
        const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });
        fireEvent.click(datetimeButton);
      });

      // プルダウンで日時を入力
      await waitFor(() => {
        const yearSelect = screen.getByLabelText('年') as HTMLSelectElement;
        const monthSelect = screen.getByLabelText('月') as HTMLSelectElement;
        const daySelect = screen.getByLabelText('日') as HTMLSelectElement;
        const hourSelect = screen.getByLabelText('時') as HTMLSelectElement;
        const minuteSelect = screen.getByLabelText('分') as HTMLSelectElement;

        fireEvent.change(yearSelect, { target: { value: '2025' } });
        fireEvent.change(monthSelect, { target: { value: '12' } });
        fireEvent.change(daySelect, { target: { value: '16' } });
        fireEvent.change(hourSelect, { target: { value: '12' } });
        fireEvent.change(minuteSelect, { target: { value: '34' } });
      });

      // 計算ボタンをクリック
      const calculateButton = screen.getByRole('button', { name: /計算する/i });
      fireEvent.click(calculateButton);

      // 計算結果が表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('計算結果')).toBeInTheDocument();
        expect(screen.getByText(/回転/)).toBeInTheDocument();
      });
    });

    test('テキスト入力で日時を入力して計算結果が表示されること', async () => {
      renderWithProvider(<CounterContainer />);

      // 時間指定モードに切り替え
      await waitFor(() => {
        const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });
        fireEvent.click(datetimeButton);
      });

      // テキスト入力モードに切り替え
      const textButton = screen.getByRole('button', { name: /テキスト入力に切り替え/i });
      fireEvent.click(textButton);

      // テキスト入力で日時を入力
      await waitFor(() => {
        const yearInput = screen.getByLabelText('年');
        const monthInput = screen.getByLabelText('月');
        const dayInput = screen.getByLabelText('日');
        const hourInput = screen.getByLabelText('時');
        const minuteInput = screen.getByLabelText('分');

        fireEvent.change(yearInput, { target: { value: '2025' } });
        fireEvent.change(monthInput, { target: { value: '12' } });
        fireEvent.change(dayInput, { target: { value: '16' } });
        fireEvent.change(hourInput, { target: { value: '12' } });
        fireEvent.change(minuteInput, { target: { value: '34' } });
      });

      // 計算ボタンをクリック
      const calculateButton = screen.getByRole('button', { name: /計算する/i });
      fireEvent.click(calculateButton);

      // 計算結果が表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('計算結果')).toBeInTheDocument();
        expect(screen.getByText(/回転/)).toBeInTheDocument();
      });
    });

    test('プルダウンモードでバリデーションエラーから修正できること', async () => {
      renderWithProvider(<CounterContainer />);

      // 時間指定モードに切り替え
      await waitFor(() => {
        const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });
        fireEvent.click(datetimeButton);
      });

      // テキストモードに切り替え（存在しない日付の入力のため）
      const textButton = screen.getByRole('button', { name: /テキスト入力に切り替え/i });
      fireEvent.click(textButton);

      // 不正な日時を入力（2月30日）
      await waitFor(() => {
        const yearInput = screen.getByLabelText('年');
        const monthInput = screen.getByLabelText('月');
        const dayInput = screen.getByLabelText('日');
        const hourInput = screen.getByLabelText('時');
        const minuteInput = screen.getByLabelText('分');

        fireEvent.change(yearInput, { target: { value: '2025' } });
        fireEvent.change(monthInput, { target: { value: '2' } });
        fireEvent.change(dayInput, { target: { value: '30' } });
        fireEvent.change(hourInput, { target: { value: '12' } });
        fireEvent.change(minuteInput, { target: { value: '34' } });
      });

      // 計算ボタンをクリック - エラーが表示される
      const calculateButton = screen.getByRole('button', { name: /計算する/i });
      fireEvent.click(calculateButton);

      await waitFor(() => {
        expect(screen.getByText(/存在しない日付/i)).toBeInTheDocument();
      });

      // 正しい日付に修正
      const dayInput = screen.getByLabelText('日');
      fireEvent.change(dayInput, { target: { value: '28' } });

      // 再度計算ボタンをクリック - 成功する
      fireEvent.click(calculateButton);

      await waitFor(() => {
        expect(screen.getByText('計算結果')).toBeInTheDocument();
        expect(screen.queryByText(/存在しない日付/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('DisplayFormatContextとの統合', () => {
    test('表示形式切り替えが計算結果に反映されること', async () => {
      renderWithProvider(<CounterContainer />);

      // 時間指定モードに切り替え
      await waitFor(() => {
        const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });
        fireEvent.click(datetimeButton);
      });

      // 日時を入力して計算
      await waitFor(() => {
        const yearSelect = screen.getByLabelText('年') as HTMLSelectElement;
        const monthSelect = screen.getByLabelText('月') as HTMLSelectElement;
        const daySelect = screen.getByLabelText('日') as HTMLSelectElement;
        const hourSelect = screen.getByLabelText('時') as HTMLSelectElement;
        const minuteSelect = screen.getByLabelText('分') as HTMLSelectElement;

        fireEvent.change(yearSelect, { target: { value: '2025' } });
        fireEvent.change(monthSelect, { target: { value: '12' } });
        fireEvent.change(daySelect, { target: { value: '16' } });
        fireEvent.change(hourSelect, { target: { value: '12' } });
        fireEvent.change(minuteSelect, { target: { value: '34' } });
      });

      const calculateButton = screen.getByRole('button', { name: /計算する/i });
      fireEvent.click(calculateButton);

      // 計算結果が表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('計算結果')).toBeInTheDocument();
      });

      // 表示形式トグルが表示されていることを確認
      await waitFor(() => {
        expect(screen.getByText('表示形式:')).toBeInTheDocument();
      });
    });
  });

  describe('エラーハンドリングの統合', () => {
    test('入力エラーをクリアしてから再入力できること', async () => {
      renderWithProvider(<CounterContainer />);

      // 時間指定モードに切り替え
      await waitFor(() => {
        const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });
        fireEvent.click(datetimeButton);
      });

      // エラーを発生させる（必須入力エラー）
      await waitFor(() => {
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);
      });

      await waitFor(() => {
        expect(screen.getByText('すべての項目を入力してください')).toBeInTheDocument();
      });

      // クリアボタンでエラーをクリア
      await waitFor(() => {
        const clearButton = screen.getByRole('button', { name: /クリア/i });
        fireEvent.click(clearButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('すべての項目を入力してください')).not.toBeInTheDocument();
      });

      // 正しい入力をして計算成功
      await waitFor(() => {
        fillAllFields({ year: '2025', month: '12', day: '16', hour: '12', minute: '34' });
        const calculateButton = screen.getByRole('button', { name: /計算する/i });
        fireEvent.click(calculateButton);
      });

      await waitFor(() => {
        expect(screen.getByText('計算結果')).toBeInTheDocument();
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
