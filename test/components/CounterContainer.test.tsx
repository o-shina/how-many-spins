import { render, screen, fireEvent } from '@testing-library/react';
import CounterContainer from '@/components/CounterContainer';
import { DisplayFormatProvider } from '@/context/DisplayFormatContext';
import React from 'react';

// MainCounterとDateTimeInputをモック化
jest.mock('@/components/MainCounter', () => {
  return function MockMainCounter() {
    return <div data-testid="main-counter">MainCounter Component</div>;
  };
});

jest.mock('@/components/DateTimeInput', () => {
  return function MockDateTimeInput() {
    return <div data-testid="datetime-input">DateTimeInput Component</div>;
  };
});

describe('CounterContainer', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <DisplayFormatProvider>{component}</DisplayFormatProvider>
    );
  };

  describe('初期表示', () => {
    test('タブ切り替えUIが表示されること', () => {
      renderWithProvider(<CounterContainer />);

      expect(screen.getByText('現在時刻')).toBeInTheDocument();
      expect(screen.getByText('時間指定')).toBeInTheDocument();
    });

    test('初期状態ではリアルタイムモードが選択されていること', () => {
      renderWithProvider(<CounterContainer />);

      const realtimeButton = screen.getByRole('button', { name: /リアルタイムモードに切り替え/i });
      const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });

      expect(realtimeButton).toHaveAttribute('aria-pressed', 'true');
      expect(datetimeButton).toHaveAttribute('aria-pressed', 'false');
    });

    test('初期状態ではMainCounterが表示されていること', () => {
      renderWithProvider(<CounterContainer />);

      expect(screen.getByTestId('main-counter')).toBeInTheDocument();
      expect(screen.queryByTestId('datetime-input')).not.toBeInTheDocument();
    });
  });

  describe('タブ切り替え', () => {
    test('時間指定タブをクリックするとDateTimeInputが表示されること', () => {
      renderWithProvider(<CounterContainer />);

      const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });
      fireEvent.click(datetimeButton);

      expect(screen.getByTestId('datetime-input')).toBeInTheDocument();
      expect(screen.queryByTestId('main-counter')).not.toBeInTheDocument();
    });

    test('時間指定タブをクリックするとaria-pressedが切り替わること', () => {
      renderWithProvider(<CounterContainer />);

      const realtimeButton = screen.getByRole('button', { name: /リアルタイムモードに切り替え/i });
      const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });

      fireEvent.click(datetimeButton);

      expect(realtimeButton).toHaveAttribute('aria-pressed', 'false');
      expect(datetimeButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('現在時刻タブをクリックするとMainCounterに戻ること', () => {
      renderWithProvider(<CounterContainer />);

      const realtimeButton = screen.getByRole('button', { name: /リアルタイムモードに切り替え/i });
      const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });

      // 時間指定モードに切り替え
      fireEvent.click(datetimeButton);
      expect(screen.getByTestId('datetime-input')).toBeInTheDocument();

      // リアルタイムモードに戻す
      fireEvent.click(realtimeButton);
      expect(screen.getByTestId('main-counter')).toBeInTheDocument();
      expect(screen.queryByTestId('datetime-input')).not.toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    test('タブボタンにaria-labelが設定されていること', () => {
      renderWithProvider(<CounterContainer />);

      expect(screen.getByRole('button', { name: /リアルタイムモードに切り替え/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /時間指定モードに切り替え/i })).toBeInTheDocument();
    });

    test('タブボタンにaria-pressedが設定されていること', () => {
      renderWithProvider(<CounterContainer />);

      const realtimeButton = screen.getByRole('button', { name: /リアルタイムモードに切り替え/i });
      const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });

      expect(realtimeButton).toHaveAttribute('aria-pressed');
      expect(datetimeButton).toHaveAttribute('aria-pressed');
    });
  });

  describe('スタイリング', () => {
    test('選択されたタブに適切なスタイルクラスが適用されていること', () => {
      renderWithProvider(<CounterContainer />);

      const realtimeButton = screen.getByRole('button', { name: /リアルタイムモードに切り替え/i });
      const datetimeButton = screen.getByRole('button', { name: /時間指定モードに切り替え/i });

      // 初期状態（リアルタイムモード選択）
      expect(realtimeButton.className).toContain('bg-blue-600');
      expect(realtimeButton.className).toContain('text-white');

      // 時間指定モードに切り替え
      fireEvent.click(datetimeButton);

      expect(datetimeButton.className).toContain('bg-blue-600');
      expect(datetimeButton.className).toContain('text-white');
    });
  });
});
