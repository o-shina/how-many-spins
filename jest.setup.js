import '@testing-library/jest-dom'

// JSDOM環境でのnavigator.clipboard設定
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

// HTMLElementにクリップボード関連のプロパティを設定
global.window.isSecureContext = true;