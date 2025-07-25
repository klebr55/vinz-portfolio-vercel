'use client';

import dynamic from 'next/dynamic';

// Componente de otimização multi-thread carregado dinamicamente apenas no cliente
const MultiThreadOptimizer = dynamic(() => import('@/components/MultiThreadOptimizer'), {
  ssr: false,
  loading: () => null
});

export default function ClientMultiThreadOptimizer() {
  return <MultiThreadOptimizer />;
}
