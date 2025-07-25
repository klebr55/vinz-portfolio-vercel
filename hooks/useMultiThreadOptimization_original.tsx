'use client';

import { useEffect, useState, useCallback } from 'react';
import { getWorkerPool, optimizedTasks, terminateWorkerPool } from '@/utils/WorkerPool';

interface PerformanceStats {
  cpuCores: number;
  activeWorkers: number;
  queuedTasks: number;
  memoryUsage?: number;
  isLowEndDevice: boolean;
}

export const useMultiThreadOptimization = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [stats, setStats] = useState<PerformanceStats>({
    cpuCores: 1,
    activeWorkers: 0,
    queuedTasks: 0,
    isLowEndDevice: true
  });

  useEffect(() => {
    // Verifica se Web Workers são suportados
    const checkSupport = () => {
      return typeof Worker !== 'undefined' && typeof window !== 'undefined';
    };

    setIsSupported(checkSupport());

    if (checkSupport()) {
      // Obtém informações do dispositivo
      const cpuCores = navigator.hardwareConcurrency || 1;
      const isLowEndDevice = cpuCores < 4;

      setStats(prev => ({
        ...prev,
        cpuCores,
        isLowEndDevice
      }));

      // Monitora performance do sistema
      const monitorPerformance = () => {
        try {
          const pool = getWorkerPool();
          const poolStats = pool.getStats();
          
          setStats(prev => ({
            ...prev,
            activeWorkers: poolStats.busyWorkers,
            queuedTasks: poolStats.queuedTasks
          }));

          // Tenta obter informações de memória se disponível
          if ('memory' in performance) {
            const memInfo = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
            if (memInfo) {
              setStats(prev => ({
                ...prev,
                memoryUsage: Math.round(memInfo.usedJSHeapSize / 1024 / 1024) // MB
              }));
            }
          }
        } catch (error) {
          console.warn('Performance monitoring error:', error);
        }
      };

      // Monitora a cada 2 segundos
      const interval = setInterval(monitorPerformance, 2000);

      return () => {
        clearInterval(interval);
        // Limpa workers quando o componente desmonta
        terminateWorkerPool();
      };
    }
  }, []);

  // Função para distribuir tarefas pesadas entre threads
  const distributeTask = useCallback(async (taskType: string, data: unknown) => {
    if (!isSupported) {
      console.warn('Web Workers not supported, falling back to main thread');
      return null;
    }

    try {
      switch (taskType) {
        case 'processImages':
          return await optimizedTasks.processImages(data as string[]);
        case 'heavyCalculation':
          return await optimizedTasks.heavyCalculation(data as Record<string, unknown>);
        case 'complexAnimation':
          return await optimizedTasks.complexAnimation(data as Record<string, unknown>);
        default:
          console.warn('Unknown task type:', taskType);
          return null;
      }
    } catch (error) {
      console.error('Task distribution error:', error);
      return null;
    }
  }, [isSupported]);

  // Otimiza componentes baseado na performance do dispositivo
  const optimizeComponent = useCallback((componentName: string) => {
    const { isLowEndDevice, cpuCores } = stats;

    // Configurações otimizadas baseadas no hardware
    const optimizations = {
      // Dispositivos de baixa performance
      lowEnd: {
        disableAnimations: true,
        reduceParticles: true,
        limitConcurrentRequests: 2,
        enableLazyLoading: true,
        reducedQuality: true
      },
      // Dispositivos de média performance
      midRange: {
        disableAnimations: false,
        reduceParticles: true,
        limitConcurrentRequests: 4,
        enableLazyLoading: true,
        reducedQuality: false
      },
      // Dispositivos de alta performance
      highEnd: {
        disableAnimations: false,
        reduceParticles: false,
        limitConcurrentRequests: 8,
        enableLazyLoading: false,
        reducedQuality: false
      }
    };

    // Determina o nível de performance
    let performanceLevel: 'lowEnd' | 'midRange' | 'highEnd';
    
    if (isLowEndDevice || cpuCores <= 2) {
      performanceLevel = 'lowEnd';
    } else if (cpuCores <= 4) {
      performanceLevel = 'midRange';
    } else {
      performanceLevel = 'highEnd';
    }

    return {
      ...optimizations[performanceLevel],
      componentName,
      recommendedThreads: Math.min(cpuCores, 4)
    };
  }, [stats]);

  // Função para pré-carregar workers
  const preloadWorkers = useCallback(() => {
    if (isSupported) {
      try {
        getWorkerPool(); // Inicializa o pool
        console.log('Worker pool preloaded successfully');
      } catch (error) {
        console.error('Failed to preload workers:', error);
      }
    }
  }, [isSupported]);

  return {
    isSupported,
    stats,
    distributeTask,
    optimizeComponent,
    preloadWorkers,
    
    // Utilitários específicos
    processImagesInParallel: (imageUrls: string[]) => distributeTask('processImages', imageUrls),
    runHeavyCalculation: (data: Record<string, unknown>) => distributeTask('heavyCalculation', data),
    generateOptimizedAnimation: (data: Record<string, unknown>) => distributeTask('complexAnimation', data),
    
    // Informações do dispositivo
    deviceInfo: {
      cpuCores: stats.cpuCores,
      isLowEnd: stats.isLowEndDevice,
      memoryUsage: stats.memoryUsage,
      recommendedWorkers: Math.min(stats.cpuCores, 4)
    }
  };
};

interface ComponentOptimizations {
  disableAnimations: boolean;
  reduceParticles: boolean;
  limitConcurrentRequests: number;
  enableLazyLoading: boolean;
  reducedQuality: boolean;
  componentName: string;
  recommendedThreads: number;
}

// Hook específico para otimização de componentes baseado no hardware
export const useHardwareOptimization = (componentName: string) => {
  const { optimizeComponent, stats } = useMultiThreadOptimization();
  const [optimizations, setOptimizations] = useState<ComponentOptimizations | null>(null);

  useEffect(() => {
    if (stats.cpuCores > 0) {
      const opts = optimizeComponent(componentName);
      setOptimizations(opts);
    }
  }, [componentName, optimizeComponent, stats.cpuCores]);

  return optimizations;
};

export default useMultiThreadOptimization;
