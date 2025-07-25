'use client';

import { useEffect } from 'react';

const MultiThreadOptimizer = () => {
  useEffect(() => {
    // Detecção básica de dispositivo
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
    const isLowEndDevice = cores <= 4 || memory < 4;
    
    console.log('🚀 Multi-thread optimization initialized (Conservative Mode)');
    console.log(`📱 Device: ${cores} cores, ${isLowEndDevice ? 'Low-end' : 'High-performance'} device`);

    // Aplica otimizações CSS conservadoras baseadas no hardware
    const styleEl = document.createElement('style');
    styleEl.id = 'multi-thread-optimizer-styles';
    
    let optimizedCSS = '';
    
    if (isLowEndDevice) {
      // CSS otimizado mais conservador para dispositivos de baixa performance
      optimizedCSS = `
        /* Otimizações conservadoras para dispositivos fracos - preserva animações */
        
        /* Otimiza scrolling sem afetar animações */
        body {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        
        /* Otimizações de imagem apenas quando necessário */
        img:not([class*="hero"]):not([class*="avatar"]):not([class*="logo"]) {
          image-rendering: -webkit-optimize-contrast;
        }
        
        /* Força aceleração de hardware apenas em elementos específicos */
        .scroll-element,
        .moving-card,
        .floating-element {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Preserva todas as animações do Animista e apenas otimiza as mais custosas */
        @media (max-width: 768px) and (prefers-reduced-motion: no-preference) {
          .heavy-animation:not([class*="slide"]):not([class*="fade"]):not([class*="bounce"]):not([class*="flip"]):not([class*="rotate"]) {
            animation-duration: 0.8s !important;
          }
        }
      `;
    } else {
      // CSS mínimo para dispositivos de alta performance
      optimizedCSS = `
        /* Otimizações mínimas para dispositivos potentes */
        
        /* Smooth scrolling apenas em dispositivos potentes */
        html {
          scroll-behavior: smooth;
        }
        
        /* Qualidade máxima de imagens */
        img {
          image-rendering: auto;
        }
        
        /* Aproveita GPU para elementos que precisam */
        .gpu-accelerated {
          will-change: transform;
        }
      `;
    }
    
    styleEl.textContent = optimizedCSS;
    document.head.appendChild(styleEl);

    // Adiciona meta tag para PWA apenas em dispositivos de baixa performance
    let pwaMeta: HTMLMetaElement | null = null;
    if (isLowEndDevice) {
      pwaMeta = document.createElement('meta');
      pwaMeta.name = 'mobile-web-app-capable';
      pwaMeta.content = 'yes';
      document.head.appendChild(pwaMeta);
    }

    // Cleanup function
    return () => {
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
      if (pwaMeta && document.head.contains(pwaMeta)) {
        document.head.removeChild(pwaMeta);
      }
    };
  }, []);

  // Componente não renderiza nada visualmente
  return null;
};

export default MultiThreadOptimizer;
