'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { TauntGenerator } from '@/lib/taunt-generator';
import { EarthRotationCalculator } from '@/lib/earth-rotation-calculator';
import { TauntData } from '@/types/earth-rotation';

/**
 * 煽りフレーズ生成・表示パネルコンポーネント
 */
function TauntPanel() {
  const [tauntData, setTauntData] = useState<TauntData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tauntGenerator = useMemo(() => new TauntGenerator(), []);
  const calculator = useMemo(() => new EarthRotationCalculator(), []);

  /**
   * 煽りフレーズを生成する
   */
  const generateTaunt = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setCopyMessage(null);

    try {
      const now = new Date();
      const rotations = calculator.calculateRotationsFromDate(now);
      const phrase = tauntGenerator.generateTaunt(now, rotations);

      const newTauntData: TauntData = {
        phrase,
        timestamp: now,
        rotations,
        copyable: true
      };

      setTauntData(newTauntData);
    } catch (err) {
      setError('煽りフレーズの生成に失敗しました');
      console.error('煽りフレーズ生成エラー:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [tauntGenerator, calculator]);

  /**
   * フレーズをクリップボードにコピーする
   */
  const copyToClipboard = useCallback(async () => {
    if (!tauntData || !tauntData.copyable) return;

    try {
      const success = await tauntGenerator.copyToClipboard(tauntData.phrase);
      
      if (success) {
        setCopyMessage('コピーしました！');
        // 3秒後にメッセージを消す
        setTimeout(() => setCopyMessage(null), 3000);
      } else {
        setCopyMessage('コピーに失敗しました。手動でコピーしてください。');
        setTimeout(() => setCopyMessage(null), 5000);
      }
    } catch (err) {
      setCopyMessage('コピー中にエラーが発生しました');
      setTimeout(() => setCopyMessage(null), 3000);
      console.error('コピーエラー:', err);
    }
  }, [tauntData, tauntGenerator]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mx-4">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          煽りフレーズ生成
        </h2>
        <p className="text-sm text-gray-600">
          「いつ？何年何月何日...？」に即答するフレーズを生成
        </p>
      </div>

      {/* 生成ボタン */}
      <div className="text-center mb-6">
        <button
          onClick={generateTaunt}
          disabled={isGenerating}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              生成中...
            </div>
          ) : (
            '煽りフレーズを生成'
          )}
        </button>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      {/* 生成されたフレーズ表示 */}
      {tauntData && (
        <div className="space-y-4">
          {/* フレーズ表示エリア */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-4">
            <p className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed">
              {tauntData.phrase}
            </p>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              📋 コピー
            </button>
            
            <button
              onClick={generateTaunt}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 再生成
            </button>
          </div>

          {/* コピー成功/失敗メッセージ */}
          {copyMessage && (
            <div className={`text-center p-2 rounded ${
              copyMessage.includes('失敗') || copyMessage.includes('エラー')
                ? 'bg-red-50 text-red-600'
                : 'bg-green-50 text-green-600'
            }`}>
              <p className="text-sm font-medium">{copyMessage}</p>
            </div>
          )}

          {/* 生成情報 */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>生成時刻: {tauntData.timestamp.toLocaleString('ja-JP')}</p>
            <p>回転数: {tauntData.rotations.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} 回転</p>
          </div>
        </div>
      )}

      {/* 初期メッセージ */}
      {!tauntData && !isGenerating && !error && (
        <div className="text-center text-gray-500">
          <p className="text-sm">
            上のボタンをクリックして煽りフレーズを生成してみましょう！
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(TauntPanel);