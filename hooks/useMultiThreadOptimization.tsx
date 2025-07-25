// Hook de otimização multi-threading
// TEMPORARIAMENTE DESABILITADO DEVIDO A PROBLEMAS DE ROTEAMENTO

import { useState, useCallback } from 'react';

export const useMultiThreadOptimization = () => {
  const [isSupported] = useState(false); // Sempre false para não tentar carregar workers
  const [stats] = useState({
    cpuCores: navigator.hardwareConcurrency || 4,
    memoryUsage: 0,
    activeWorkers: 0
  });
  const [deviceInfo] = useState({
    isLowEnd: false,
    recommendedWorkers: 0
  });

  const preloadWorkers = useCallback(() => {
    // Função vazia - workers desabilitados
  }, []);

  const distributeTask = useCallback(async () => {
    // Função vazia - workers desabilitados
    return null;
  }, []);

  return {
    isSupported,
    stats,
    deviceInfo,
    preloadWorkers,
    distributeTask
  };
};

// Componente wrapper também desabilitado
export const OptimizedComponent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default useMultiThreadOptimization;
