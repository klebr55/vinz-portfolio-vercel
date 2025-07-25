// Worker pool para distribuir tarefas entre múltiplas threads
// TEMPORARIAMENTE DESABILITADO DEVIDO A PROBLEMAS DE ROTEAMENTO

/*
interface TaskData {
  type: string;
  [key: string]: unknown;
}

interface QueuedTask {
  task: TaskData;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: QueuedTask[] = [];
  private busyWorkers = new Set<number>();

  constructor(private maxWorkers: number = navigator.hardwareConcurrency || 4) {
    this.initializeWorkers();
  }

  private initializeWorkers() {
    // Cria workers baseado no número de núcleos da CPU
    const optimalWorkerCount = Math.min(this.maxWorkers, 4); // Máximo 4 para não sobrecarregar
    
    for (let i = 0; i < optimalWorkerCount; i++) {
      try {
        // Usa caminho absoluto para evitar problemas com roteamento do Next.js
        const workerPath = new URL('/workers/computation-worker.js', window.location.origin).href;
        const worker = new Worker(workerPath);
        worker.onmessage = (e) => this.handleWorkerMessage(i, e);
        worker.onerror = (e) => this.handleWorkerError(i, e);
        this.workers[i] = worker;
      } catch (error) {
        console.warn(`Failed to create worker ${i}:`, error);
      }
    }
  }

  private handleWorkerMessage(workerId: number, event: MessageEvent) {
    this.busyWorkers.delete(workerId);
    
    // Processa próxima tarefa na fila se houver
    this.processNextTask();
  }

  private handleWorkerError(workerId: number, error: ErrorEvent) {
    console.error(`Worker ${workerId} error:`, {
      message: error.message,
      filename: error.filename,
      lineno: error.lineno,
      colno: error.colno,
      error: error.error
    });
    this.busyWorkers.delete(workerId);
    
    // Tenta recriar o worker se possível
    this.recreateWorker(workerId);
  }

  private recreateWorker(workerId: number) {
    try {
      if (this.workers[workerId]) {
        this.workers[workerId].terminate();
      }
      
      const workerPath = new URL('/workers/computation-worker.js', window.location.origin).href;
      const worker = new Worker(workerPath);
      worker.onmessage = (e) => this.handleWorkerMessage(workerId, e);
      worker.onerror = (e) => this.handleWorkerError(workerId, e);
      this.workers[workerId] = worker;
      
      console.log(`Worker ${workerId} recreated successfully`);
    } catch (error) {
      console.error(`Failed to recreate worker ${workerId}:`, error);
    }
    this.processNextTask();
  }

  private processNextTask() {
    if (this.taskQueue.length === 0) return;

    const availableWorker = this.workers.findIndex((_, index) => 
      !this.busyWorkers.has(index)
    );

    if (availableWorker !== -1) {
      const task = this.taskQueue.shift();
      if (task) {
        this.busyWorkers.add(availableWorker);
        this.workers[availableWorker].postMessage(task.task);
      }
    }
  }

  public async executeTask<T>(taskData: TaskData): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const task: QueuedTask = { 
        task: taskData, 
        resolve: resolve as (value: unknown) => void, 
        reject 
      };
      
      // Tenta executar imediatamente se há worker disponível
      const availableWorker = this.workers.findIndex((_, index) => 
        !this.busyWorkers.has(index)
      );

      if (availableWorker !== -1) {
        this.busyWorkers.add(availableWorker);
        this.workers[availableWorker].postMessage(taskData);
        
        // Setup listener temporário para esta tarefa específica
        const messageHandler = (e: MessageEvent) => {
          this.workers[availableWorker].removeEventListener('message', messageHandler);
          this.busyWorkers.delete(availableWorker);
          resolve(e.data);
          this.processNextTask();
        };
        
        this.workers[availableWorker].addEventListener('message', messageHandler);
      } else {
        // Adiciona à fila se todos os workers estão ocupados
        this.taskQueue.push(task);
      }
    });
  }

  public terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.taskQueue = [];
    this.busyWorkers.clear();
  }

  public getStats() {
    return {
      totalWorkers: this.workers.length,
      busyWorkers: this.busyWorkers.size,
      queuedTasks: this.taskQueue.length,
      cpuCores: navigator.hardwareConcurrency || 'unknown'
    };
  }
}

// Singleton para gerenciar o pool de workers
let workerPoolInstance: WorkerPool | null = null;

export const getWorkerPool = (): WorkerPool => {
  if (!workerPoolInstance) {
    workerPoolInstance = new WorkerPool();
  }
  return workerPoolInstance;
};

export const terminateWorkerPool = () => {
  if (workerPoolInstance) {
    workerPoolInstance.terminate();
    workerPoolInstance = null;
  }
};

// Utilitários para tarefas comuns que podem ser otimizadas
export const optimizedTasks = {
  // Processamento de imagens em paralelo
  processImages: async (imageUrls: string[]) => {
    const pool = getWorkerPool();
    const tasks = imageUrls.map(url => 
      pool.executeTask({ type: 'processImage', url })
    );
    return Promise.all(tasks);
  },

  // Cálculos matemáticos pesados
  heavyCalculation: async (data: Record<string, unknown>) => {
    const pool = getWorkerPool();
    return pool.executeTask({ type: 'calculate', data });
  },

  // Animações complexas
  complexAnimation: async (animationData: Record<string, unknown>) => {
    const pool = getWorkerPool();
    return pool.executeTask({ type: 'animate', data: animationData });
  }
};

export default WorkerPool;
