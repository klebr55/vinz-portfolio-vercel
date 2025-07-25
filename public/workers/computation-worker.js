// Web Worker para processamento em background
// Este arquivo roda em uma thread separada da UI

// Funções de processamento pesado
const processors = {
  // Processamento de imagens
  processImage: async (url) => {
    try {
      // Simula processamento de imagem otimizado
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Cria um canvas offscreen para processamento
      if (typeof OffscreenCanvas !== 'undefined') {
        const offscreenCanvas = new OffscreenCanvas(800, 600);
        const ctx = offscreenCanvas.getContext('2d');
        
        if (ctx) {
          // Processamento de imagem sem bloquear a UI
          const imageData = ctx.createImageData(800, 600);
          // Aplicar filtros, redimensionamento, etc.
          console.log('Image processed:', imageData.width);
          
          return {
            success: true,
            processedSize: blob.size,
            dimensions: { width: 800, height: 600 }
          };
        }
      }
      
      return { success: true, processedSize: blob.size };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Cálculos matemáticos pesados
  calculate: (data) => {
    const { numbers, operation } = data;
    
    switch (operation) {
      case 'fibonacci':
        const n = numbers[0] || 10;
        const fib = (num) => {
          if (num <= 1) return num;
          return fib(num - 1) + fib(num - 2);
        };
        return { result: fib(n) };
        
      case 'primes':
        const limit = numbers[0] || 1000;
        const primes = [];
        for (let i = 2; i <= limit; i++) {
          let isPrime = true;
          for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
              isPrime = false;
              break;
            }
          }
          if (isPrime) primes.push(i);
        }
        return { result: primes };
        
      case 'matrix':
        // Multiplicação de matrizes otimizada
        const { matrixA, matrixB } = data;
        const result = multiplyMatrices(matrixA, matrixB);
        return { result };
        
      default:
        return { result: numbers.reduce((a, b) => a + b, 0) };
    }
  },

  // Processamento de animações complexas
  animate: (data) => {
    const { frames, duration, easing } = data;
    
    // Calcula keyframes otimizados
    const keyframes = [];
    const totalFrames = frames || 60;
    
    for (let i = 0; i <= totalFrames; i++) {
      const progress = i / totalFrames;
      let easedProgress = progress;
      
      // Aplica easing functions
      switch (easing) {
        case 'ease-in':
          easedProgress = progress * progress;
          break;
        case 'ease-out':
          easedProgress = 1 - Math.pow(1 - progress, 2);
          break;
        case 'ease-in-out':
          easedProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          break;
      }
      
      keyframes.push({
        frame: i,
        progress: easedProgress,
        timestamp: (duration || 1000) * easedProgress
      });
    }
    
    return { keyframes, totalFrames };
  }
};

// Função auxiliar para multiplicação de matrizes
function multiplyMatrices(a, b) {
  const result = [];
  const aRows = a.length;
  const aCols = a[0].length;
  const bCols = b[0].length;
  
  for (let i = 0; i < aRows; i++) {
    result[i] = [];
    for (let j = 0; j < bCols; j++) {
      let sum = 0;
      for (let k = 0; k < aCols; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  
  return result;
}

// Event listener principal do worker
self.addEventListener('message', async (event) => {
  const { type, ...data } = event.data;
  
  try {
    let result;
    
    switch (type) {
      case 'processImage':
        result = await processors.processImage(data.url);
        break;
      case 'calculate':
        result = processors.calculate(data.data);
        break;
      case 'animate':
        result = processors.animate(data.data);
        break;
      default:
        result = { error: `Unknown task type: ${type}` };
    }
    
    // Envia resultado de volta para a thread principal
    self.postMessage({
      type: 'success',
      taskType: type,
      result
    });
    
  } catch (error) {
    // Envia erro de volta para a thread principal
    self.postMessage({
      type: 'error',
      taskType: type,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Indica que o worker está pronto
self.postMessage({ type: 'ready' });
