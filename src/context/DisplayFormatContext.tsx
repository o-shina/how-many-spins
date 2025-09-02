'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DisplayFormat = 'integer' | 'decimal';

interface DisplayFormatContextType {
  format: DisplayFormat;
  isLoaded: boolean;
  toggleFormat: () => void;
  formatRotation: (rotations: number) => string;
  isInteger: boolean;
  isDecimal: boolean;
}

const STORAGE_KEY = 'rotation-display-format';
const DEFAULT_FORMAT: DisplayFormat = 'integer';

const DisplayFormatContext = createContext<DisplayFormatContextType | undefined>(undefined);

export function DisplayFormatProvider({ children }: { children: ReactNode }) {
  const [format, setFormat] = useState<DisplayFormat>(DEFAULT_FORMAT);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初期化時にローカルストレージから設定を読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'integer' || stored === 'decimal') {
        setFormat(stored);
      }
    } catch (error) {
      console.warn('Failed to load display format from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 表示形式を変更し、ローカルストレージに保存
  const toggleFormat = () => {
    const newFormat: DisplayFormat = format === 'integer' ? 'decimal' : 'integer';
    setFormat(newFormat);
    
    try {
      localStorage.setItem(STORAGE_KEY, newFormat);
    } catch (error) {
      console.warn('Failed to save display format to localStorage:', error);
    }
  };

  // 回転数を指定された形式でフォーマット
  const formatRotation = (rotations: number): string => {
    if (format === 'integer') {
      return Math.floor(rotations).toLocaleString('ja-JP');
    } else {
      return rotations.toLocaleString('ja-JP', {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      });
    }
  };

  const value: DisplayFormatContextType = {
    format,
    isLoaded,
    toggleFormat,
    formatRotation,
    isInteger: format === 'integer',
    isDecimal: format === 'decimal',
  };

  return (
    <DisplayFormatContext.Provider value={value}>
      {children}
    </DisplayFormatContext.Provider>
  );
}

export function useDisplayFormat() {
  const context = useContext(DisplayFormatContext);
  if (context === undefined) {
    throw new Error('useDisplayFormat must be used within a DisplayFormatProvider');
  }
  return context;
}