/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/how-many-spins' : '',
  assetPrefix: isProd ? '/how-many-spins' : '',
  images: {
    unoptimized: true
  },
  
  // パフォーマンス最適化
  swcMinify: true,
  
  // 静的最適化 - optimizeCssは現在のバージョンでは問題があるためコメントアウト
  // experimental: {
  //   optimizeCss: true,
  // },
  
  // バンドル分析（必要に応じて）
  // webpack: (config, { dev, isServer }) => {
  //   if (!dev && !isServer) {
  //     config.resolve.alias = {
  //       ...config.resolve.alias,
  //       '@': path.resolve(__dirname, 'src'),
  //     };
  //   }
  //   return config;
  // },
  
  // コンパイラオプション
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 圧縮最適化
  compress: true,
}

module.exports = nextConfig