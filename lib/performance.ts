// Performance optimization utilities for Allo Health

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private startTimes: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): void {
    this.startTimes.set(label, performance.now());
  }

  endTimer(label: string): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.metrics.set(label, duration);
    this.startTimes.delete(label);
    
    return duration;
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

// Bundle optimization utilities
export const bundleOptimizer = {
  // Preload critical components
  preload: (importFunc: () => Promise<any>): void => {
    // Preload in the background
    setTimeout(() => {
      importFunc();
    }, 100);
  },
};

// Memory optimization utilities
export const memoryOptimizer = {
  // Debounce function calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function calls
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Memoize expensive calculations
  memoize: <T extends (...args: any[]) => any>(
    func: T,
    getKey?: (...args: Parameters<T>) => string
  ): T => {
    const cache = new Map<string, ReturnType<T>>();
    
    return ((...args: Parameters<T>) => {
      const key = getKey ? getKey(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  },
};

// Image optimization utilities
export const imageOptimizer = {
  // Generate responsive image sizes
  getResponsiveSizes: (baseSize: number): number[] => {
    return [baseSize, baseSize * 1.5, baseSize * 2, baseSize * 3];
  },

  // Check if image is loaded
  isImageLoaded: (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  },
};

// Cache optimization utilities
export const cacheOptimizer = {
  // Simple in-memory cache with TTL
  createCache: <T>(ttl: number = 5 * 60 * 1000) => {
    const cache = new Map<string, { value: T; timestamp: number }>();
    
    return {
      get: (key: string): T | undefined => {
        const item = cache.get(key);
        if (!item) return undefined;
        
        const now = Date.now();
        if (now - item.timestamp > ttl) {
          cache.delete(key);
          return undefined;
        }
        
        return item.value;
      },
      
      set: (key: string, value: T): void => {
        cache.set(key, { value, timestamp: Date.now() });
      },
      
      clear: (): void => {
        cache.clear();
      },
      
      size: (): number => cache.size,
    };
  },
};

// Network optimization utilities
export const networkOptimizer = {
  // Retry function with exponential backoff
  retry: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (i === maxRetries - 1) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },
};

// Default export
export default {
  PerformanceMonitor,
  bundleOptimizer,
  memoryOptimizer,
  imageOptimizer,
  cacheOptimizer,
  networkOptimizer,
};
