'use client';

import { useState, useEffect } from 'react';

export type DisplayFormat = 'integer' | 'decimal';

const STORAGE_KEY = 'rotation-display-format';
const DEFAULT_FORMAT: DisplayFormat = 'integer';

/**
 * 回転数表示形式の状態管理フック
 * ローカルストレージへの永続化機能付き
 */
export function useDisplayFormat() {
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

  return {
    format,
    isLoaded,
    toggleFormat,
    formatRotation,
    isInteger: format === 'integer',
    isDecimal: format === 'decimal',
  };
}