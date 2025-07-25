// Worker pool para distribuir tarefas entre múltiplas threads
// TEMPORARIAMENTE DESABILITADO DEVIDO A PROBLEMAS DE ROTEAMENTO

// Exports vazios para manter compatibilidade
export const getWorkerPool = () => null;
export const terminateWorkerPool = () => {};
export const optimizedTasks = {
  processImages: async () => [],
  heavyCalculation: async () => null,
  parallelAnimations: async () => []
};

export default class WorkerPool {
  terminate() {}
  getStats() {
    return {
      totalWorkers: 0,
      busyWorkers: 0,
      queuedTasks: 0,
      cpuCores: navigator.hardwareConcurrency || 'unknown'
    };
  }
}

/*
CONTEÚDO ORIGINAL COMENTADO PARA RESOLVER PROBLEMAS DE ROTEAMENTO COM WEB WORKERS E NEXT.JS:

O sistema completo de Web Workers foi implementado mas está temporariamente desabilitado
devido a conflitos com o roteamento internacionalizado do Next.js que causa loops infinitos
de tentativa de carregamento de workers em URLs como /en/workers/ e /pt-br/workers/.

Para reativar, será necessário resolver o problema de roteamento ou implementar
uma estratégia alternativa de carregamento de workers.
*/
