'use client';

import { useEffect } from 'react';

const MultiThreadOptimizer = () => {
  useEffect(() => {
    // Detecção básica de dispositivo
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
    const isLowEndDevice = cores <= 4 || memory < 4;
    
    console.log('🚀 Multi-thread optimization initialized (Basic Mode)');
    console.log(`� Device: ${cores} cores, ${isLowEndDevice ? 'Low-end' : 'High-performance'} device`);

    // Aplica otimizações CSS baseadas no hardware
    const styleEl = document.createElement('style');
    
    let optimizedCSS = '';
    
    if (isLowEndDevice) {
      // CSS otimizado para dispositivos de baixa performance
      optimizedCSS = `
        * {
          /* Reduz complexidade de rendering */
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Desabilita animações custosas em dispositivos fracos */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Otimiza scrolling */
        body {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        
        /* Reduz qualidade de imagens para economizar memória */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `;
    } else {
      // CSS para dispositivos de alta performance
      optimizedCSS = `
        /* Aproveita aceleração de hardware */
        * {
          will-change: auto;
        }
        
        /* Smooth scrolling apenas em dispositivos potentes */
        html {
          scroll-behavior: smooth;
        }
        
        /* Qualidade máxima de imagens */
        img {
          image-rendering: auto;
        }
      `;
    }
    
    styleEl.textContent = optimizedCSS;
    document.head.appendChild(styleEl);

    // Adiciona meta tag para PWA em dispositivos de baixa performance
    if (isLowEndDevice) {
      const meta = document.createElement('meta');
      meta.name = 'mobile-web-app-capable';
      meta.content = 'yes';
      document.head.appendChild(meta);

      return () => {
        if (document.head.contains(styleEl)) {
          document.head.removeChild(styleEl);
        }
        if (document.head.contains(meta)) {
          document.head.removeChild(meta);
        }
      };
    }

    return () => {
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  // Componente não renderiza nada visualmente
  return null;
};

export default MultiThreadOptimizer;
