/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Configuração otimizada para Vercel
  poweredByHeader: false,
  compress: true,
  
  images: {
    // Usar otimizador nativo do Next.js na Vercel
    formats: ['image/webp', 'image/avif'],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    domains: [], // Adicione domínios externos se necessário
  },
  
  // Headers de segurança e performance
  async headers() {
    return [
      {
        source: '/api/og',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
          {
            key: 'Content-Type',
            value: 'image/png',
          },
        ],
      },
      {
        source: '/workers/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects para SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  env: {
    storePicturesInWEBP: 'true',
    generateAndUseBlurImages: 'true',
    imageOptimization: 'true',
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', '@heroicons/react'],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack: (config, { isServer }) => {
    // Configurações do Webpack (usadas quando não usar --turbo)
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    });

    // Optimize SVG loading
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    
    // Bundle splitting optimizations
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 244000,
          },
        },
      };
    }
    
    return config;
  }
};

export default withBundleAnalyzer(withNextIntl(nextConfig));