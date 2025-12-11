import { renderHook, act } from '@testing-library/react';
import { useDisplayFormat } from '@/hooks/useDisplayFormat';
import { DisplayFormatProvider } from '@/context/DisplayFormatContext';
import React from 'react';

// localStorage のモック
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useDisplayFormat', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  test('デフォルトで整数表示モードになること', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DisplayFormatProvider>{children}</DisplayFormatProvider>
    );
    
    const { result } = renderHook(() => useDisplayFormat(), { wrapper });
    
    expect(result.current.format).toBe('integer');
    expect(result.current.isInteger).toBe(true);
    expect(result.current.isDecimal).toBe(false);
    expect(result.current.isLoaded).toBe(true);
  });

  test('ローカルストレージから設定を読み込むこと', () => {
    localStorageMock.getItem.mockReturnValue('decimal');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DisplayFormatProvider>{children}</DisplayFormatProvider>
    );
    
    const { result } = renderHook(() => useDisplayFormat(), { wrapper });
    
    expect(result.current.format).toBe('decimal');
    expect(result.current.isInteger).toBe(false);
    expect(result.current.isDecimal).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('rotation-display-format');
  });

  test('toggleFormat で表示形式が切り替わること', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DisplayFormatProvider>{children}</DisplayFormatProvider>
    );
    
    const { result } = renderHook(() => useDisplayFormat(), { wrapper });
    
    expect(result.current.format).toBe('integer');
    
    act(() => {
      result.current.toggleFormat();
    });
    
    expect(result.current.format).toBe('decimal');
    expect(result.current.isInteger).toBe(false);
    expect(result.current.isDecimal).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('rotation-display-format', 'decimal');
  });

  test('整数表示で正しくフォーマットされること', () => {
    localStorageMock.getItem.mockReturnValue('integer');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DisplayFormatProvider>{children}</DisplayFormatProvider>
    );
    
    const { result } = renderHook(() => useDisplayFormat(), { wrapper });
    
    const formatted = result.current.formatRotation(1234567.123456);
    expect(formatted).toBe('1,234,567');
  });

  test('小数表示で正しくフォーマットされること', () => {
    localStorageMock.getItem.mockReturnValue('decimal');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DisplayFormatProvider>{children}</DisplayFormatProvider>
    );
    
    const { result } = renderHook(() => useDisplayFormat(), { wrapper });
    
    const formatted = result.current.formatRotation(1234567.123456);
    expect(formatted).toBe('1,234,567.123456');
  });

  test('ローカルストレージ読み込みエラーでもデフォルト値を使用すること', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DisplayFormatProvider>{children}</DisplayFormatProvider>
    );
    
    const { result } = renderHook(() => useDisplayFormat(), { wrapper });
    
    expect(result.current.format).toBe('integer');
    expect(result.current.isLoaded).toBe(true);
  });

  test('ローカルストレージ書き込みエラーでも動作すること', () => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DisplayFormatProvider>{children}</DisplayFormatProvider>
    );
    
    const { result } = renderHook(() => useDisplayFormat(), { wrapper });
    
    expect(result.current.format).toBe('integer');
    
    act(() => {
      result.current.toggleFormat();
    });
    
    expect(result.current.format).toBe('decimal');
    // エラーが発生してもフックは正常に動作する
  });

  test('不正なローカルストレージ値でもデフォルト値を使用すること', () => {
    localStorageMock.getItem.mockReturnValue('invalid-value');
    
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <DisplayFormatProvider>{children}</DisplayFormatProvider>
    );
    
    const { result } = renderHook(() => useDisplayFormat(), { wrapper });
    
    expect(result.current.format).toBe('integer');
  });
});