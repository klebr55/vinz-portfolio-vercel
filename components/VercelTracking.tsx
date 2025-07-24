'use client';

import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { useEffect } from 'react';

export default function VercelTracking() {
  useEffect(() => {
    // Força a inicialização do Speed Insights
    if (typeof window !== 'undefined') {
      // Dispara um evento personalizado para garantir que o tracking inicie
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('vercel-speed-insights-init'));
      }, 1000);
    }
  }, []);

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
