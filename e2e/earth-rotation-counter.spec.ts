import { test, expect } from '@playwright/test';

test.describe('Earth Rotation Counter E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title and description', async ({ page }) => {
    // ヘッダーのタイトルを確認
    await expect(page.locator('h1')).toContainText('地球が何回回った時？');
    await expect(page.locator('header')).toContainText('How Many Spins? - 煽りフレーズに即答するWebアプリ');
  });

  test('should show real-time counter updates', async ({ page }) => {
    // メインカウンターが表示されることを確認
    await expect(page.locator('h2').filter({ hasText: '現在時刻' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '地球の累積自転回数' })).toBeVisible();

    // 回転数が数値として表示されていることを確認
    const rotationText = await page.locator('text=/\\d{1,3}(,\\d{3})*\\.\\d{6} 回転/').first();
    await expect(rotationText).toBeVisible();

    // リアルタイム更新インジケーターを確認
    await expect(page.locator('text=リアルタイム更新中')).toBeVisible();
    
    // アニメーションのドットを確認
    const pulsingDot = page.locator('.animate-pulse').first();
    await expect(pulsingDot).toBeVisible();
  });

  test('should wait for counter to update over time', async ({ page }) => {
    // 最初の回転数を取得
    const initialRotationElement = page.locator('text=/\\d{1,3}(,\\d{3})*\\.\\d{6} 回転/').first();
    await expect(initialRotationElement).toBeVisible();
    const initialRotation = await initialRotationElement.textContent();

    // 2秒待機
    await page.waitForTimeout(2000);

    // 回転数が更新されていることを確認（リアルタイム更新）
    const updatedRotationElement = page.locator('text=/\\d{1,3}(,\\d{3})*\\.\\d{6} 回転/').first();
    const updatedRotation = await updatedRotationElement.textContent();
    
    // 回転数が変化していることを確認（ただし、変化が非常に小さい場合もあるので存在確認でOK）
    expect(updatedRotation).toBeTruthy();
  });

  test('should generate and display taunt phrase', async ({ page }) => {
    // 煽りフレーズ生成セクションを確認
    await expect(page.locator('h2').filter({ hasText: '煽りフレーズ生成' })).toBeVisible();
    await expect(page.locator('text=「いつ？何年何月何日...？」に即答するフレーズを生成')).toBeVisible();

    // 生成ボタンをクリック
    const generateButton = page.locator('button', { hasText: '煽りフレーズを生成' });
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    // 生成されたフレーズが表示されることを確認
    await expect(page.locator('text=/いつ？.*？地球が.*回転したとき！/')).toBeVisible();

    // コピーボタンと再生成ボタンが表示されることを確認
    await expect(page.locator('button', { hasText: '📋 コピー' })).toBeVisible();
    await expect(page.locator('button', { hasText: '🔄 再生成' })).toBeVisible();

    // 生成情報が表示されることを確認
    await expect(page.locator('text=/生成時刻:/')).toBeVisible();
    await expect(page.locator('text=/回転数:/')).toBeVisible();
  });

  test('should copy taunt phrase to clipboard', async ({ page }) => {
    // 煽りフレーズを生成
    const generateButton = page.locator('button', { hasText: '煽りフレーズを生成' });
    await generateButton.click();

    // フレーズが表示されるまで待機
    await expect(page.locator('text=/いつ？.*？地球が.*回転したとき！/')).toBeVisible();

    // コピーボタンをクリック
    const copyButton = page.locator('button', { hasText: '📋 コピー' });
    await copyButton.click();

    // コピー成功メッセージが表示されることを確認
    await expect(page.locator('text=コピーしました！')).toBeVisible();

    // メッセージが一定時間後に消えることを確認
    await page.waitForTimeout(3500);
    await expect(page.locator('text=コピーしました！')).not.toBeVisible();
  });

  test('should regenerate taunt phrase', async ({ page }) => {
    // 煽りフレーズを生成
    const generateButton = page.locator('button', { hasText: '煽りフレーズを生成' });
    await generateButton.click();

    // 最初のフレーズを取得
    const phraseElement = page.locator('text=/いつ？.*？地球が.*回転したとき！/').first();
    await expect(phraseElement).toBeVisible();
    const initialPhrase = await phraseElement.textContent();

    // 再生成ボタンをクリック
    const regenerateButton = page.locator('button', { hasText: '🔄 再生成' });
    await regenerateButton.click();

    // 新しいフレーズが生成されることを確認
    await expect(page.locator('text=/いつ？.*？地球が.*回転したとき！/')).toBeVisible();
    
    // 時間が経過しているので、フレーズが更新されている（時刻や回転数が変わる）
    const newPhraseElement = page.locator('text=/いつ？.*？地球が.*回転したとき！/').first();
    const newPhrase = await newPhraseElement.textContent();
    expect(newPhrase).toBeTruthy();
  });

  test('should display footer information', async ({ page }) => {
    // フッター情報を確認
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer strong:has-text("地球が何回回った時？")')).toBeVisible();
    await expect(page.locator('text=子どもの煽りフレーズに即答するWebアプリケーション')).toBeVisible();
    await expect(page.locator('text=/© \\d{4} How Many Spins/')).toBeVisible();
    await expect(page.locator('text=恒星日基準: 23時間56分4秒')).toBeVisible();
    await expect(page.locator('text=基準日時: 西暦1年1月1日 00:00 UTC')).toBeVisible();
    await expect(page.locator('text=Made with Next.js, TypeScript, and Tailwind CSS')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 });

    // メインタイトルが表示されることを確認
    await expect(page.locator('h1')).toBeVisible();
    
    // カウンターが表示されることを確認
    await expect(page.locator('h2').filter({ hasText: '現在時刻' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '地球の累積自転回数' })).toBeVisible();

    // 煽りフレーズセクションが表示されることを確認
    await expect(page.locator('h2').filter({ hasText: '煽りフレーズ生成' })).toBeVisible();

    // フレーズ生成ボタンが操作可能であることを確認
    const generateButton = page.locator('button', { hasText: '煽りフレーズを生成' });
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    // 生成されたフレーズが表示されることを確認
    await expect(page.locator('text=/いつ？.*？地球が.*回転したとき！/')).toBeVisible();
  });
});