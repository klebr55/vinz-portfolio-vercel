/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';

// Hook para detectar performance do dispositivo
export const useDevicePerformance = () => {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detecta se é móvel
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
    };

    // Detecta performance do dispositivo
    const checkPerformance = () => {
      // Critérios para dispositivo de baixa performance
      const cores = navigator.hardwareConcurrency || 2;
      const connection = (navigator as any).connection;
      
      let isLowPerf = false;

      // Menos de 4 cores indica dispositivo mais básico
      if (cores < 4) isLowPerf = true;

      // Conexão lenta
      if (connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')) {
        isLowPerf = true;
      }

      // Pouca memória disponível (aproximação)
      try {
        const memoryInfo = (performance as any).memory;
        if (memoryInfo && memoryInfo.totalJSHeapSize < 50 * 1024 * 1024) { // Menos de 50MB
          isLowPerf = true;
        }
      } catch (e) {
        // Ignore se não suportado
      }

      return isLowPerf;
    };

    setIsMobile(checkMobile());
    setIsLowEnd(checkPerformance());

    // Listener para mudanças de tamanho da tela
    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isLowEnd, isMobile, shouldOptimize: isLowEnd || isMobile };
};

// Componente para carregar script de forma lazy
export const LazyScript = ({ src, onLoad }: { src: string; onLoad?: () => void }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    
    if (onLoad) {
      script.onload = onLoad;
    }

    // Adiciona o script após um delay para não bloquear a renderização inicial
    setTimeout(() => {
      document.head.appendChild(script);
    }, 2000);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [src, onLoad]);

  return null;
};

// Wrapper para componentes que devem ser carregados condicionalmente
export const ConditionalRender = ({ 
  children, 
  fallback, 
  condition = 'always' 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
  condition?: 'always' | 'high-performance-only' | 'desktop-only';
}) => {
  const { isLowEnd, isMobile } = useDevicePerformance();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    switch (condition) {
      case 'high-performance-only':
        setShouldRender(!isLowEnd);
        break;
      case 'desktop-only':
        setShouldRender(!isMobile);
        break;
      default:
        setShouldRender(true);
    }
  }, [condition, isLowEnd, isMobile]);

  if (!shouldRender && fallback) {
    return <>{fallback}</>;
  }

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
};

export default useDevicePerformance;
