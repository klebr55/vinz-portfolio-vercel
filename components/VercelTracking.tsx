'use client';

import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { useEffect, useState } from 'react';

export default function VercelTracking() {
  const [shouldTrack, setShouldTrack] = useState(false);

  useEffect(() => {
    // Só inicia o tracking após um delay e verifica se o dispositivo não está sobrecarregado
    const initTracking = () => {
      // Verifica se o dispositivo tem boa performance baseado nos cores
      const hasGoodPerformance = navigator.hardwareConcurrency >= 4;
      
      // Só ativa tracking imediatamente se o dispositivo for potente
      if (hasGoodPerformance) {
        setShouldTrack(true);
      } else {
        // Para dispositivos mais fracos, ativa após 5 segundos
        setTimeout(() => setShouldTrack(true), 5000);
      }
    };

    // Inicia após o site estar completamente carregado
    if (document.readyState === 'complete') {
      initTracking();
    } else {
      window.addEventListener('load', initTracking);
      return () => window.removeEventListener('load', initTracking);
    }
  }, []);

  // Não renderiza nada se não deve fazer tracking ainda
  if (!shouldTrack) return null;

  return (
    <>
      <VercelSpeedInsights 
        debug={process.env.NODE_ENV === 'development'} 
      />
      <VercelAnalytics 
        debug={process.env.NODE_ENV === 'development'} 
      />
    </>
  );
}
