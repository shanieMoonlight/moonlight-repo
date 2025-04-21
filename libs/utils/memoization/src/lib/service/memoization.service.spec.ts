import { TestBed } from '@angular/core/testing';
import { MemoizationService } from './memoization.service';

describe('MemoizationService', () => {
  let service: MemoizationService;

  // A simple expensive function we'll memoize
  const fibonacci = (n: number): number => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };

  // A function that captures call count for testing
  let callCount = 0;
  const countedFunction = (input: string): string => {
    callCount++;
    return input.toUpperCase();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoizationService);
    callCount = 0; // Reset call count before each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Basic memoization', () => {
    it('should cache function results for identical inputs', () => {
      // Create memoized version of counted function
      const memoizedFn = service.memoize<[string], string>('test')(countedFunction);

      // First call - should execute function
      memoizedFn('hello');
      expect(callCount).toBe(1);

      // Second call with same input - should use cache
      memoizedFn('hello');
      expect(callCount).toBe(1); // Count shouldn't increase
    });

    it('should calculate new results for different inputs', () => {
      const memoizedFn = service.memoize<[string], string>('test')(countedFunction);

      memoizedFn('hello');
      expect(callCount).toBe(1);

      memoizedFn('world'); // Different input
      expect(callCount).toBe(2); // Count should increase
    });

    it('should improve performance for expensive calculations', () => {
      // A more predictable expensive function
      const expensiveFunction = (iterations: number): number => {
        let result = 0;
        for (let i = 0; i < iterations; i++) {
          result += Math.sin(i) * Math.cos(i);
        }
        return result;
      };
      
      const memoizedFn = service.memoize<[number], number>('expensive')(expensiveFunction);
      
      // First call
      const start1 = performance.now();
      const result1 = memoizedFn(100000); // Use a larger number that takes measurable time
      const duration1 = performance.now() - start1;
      
      // Second call
      const start2 = performance.now();
      const result2 = memoizedFn(100000);
      const duration2 = performance.now() - start2;
      
      console.log(`Duration 1: ${duration1}ms, Duration 2: ${duration2}ms`);
      
      expect(result1).toBe(result2);
      // Be more lenient - any significant improvement is good
      expect(duration2).toBeLessThan(duration1 * 0.5); // At least 2x faster
    });
  });

  describe('Custom key generation', () => {
    it('should respect custom key generators', () => {
      // Function that takes an object, but we only care about one property
      const processUser = (user: { id: number, name: string }): string => {
        callCount++;
        return `User ${user.name}`;
      };

      // Create memoized version with custom key generator
      const memoizedFn = service.memoize<[{ id: number, name: string }], string>('users')(
        processUser,
        (user) => `user-${user.id}` // Key only based on ID
      );

      // First call
      memoizedFn({ id: 1, name: 'Alice' });
      expect(callCount).toBe(1);

      // Different name, same ID - should use cache
      memoizedFn({ id: 1, name: 'Modified Alice' });
      expect(callCount).toBe(1); // Name changed but ID is the same

      // Different ID - should calculate new result
      memoizedFn({ id: 2, name: 'Bob' });
      expect(callCount).toBe(2);
    });
  });

  describe('Cache management', () => {
    it('should respect cache size limits', () => {
      // Create cache with small limit
      const memoizedFn = service.memoize<[number], string>('limited', { maxSize: 2 })(
        (n) => `Result ${n}`
      );

      // Fill cache
      memoizedFn(1);
      memoizedFn(2);

      // Force eviction by adding third entry
      memoizedFn(3);

      // Get cache stats
      const stats = service.getCacheStats();

      // Size should respect limit
      expect(stats['limited'].size).toBe(2);
    });

    it('should clear specific namespaces', () => {
      // Create two caches
      const fnA = service.memoize<[number], string>('namespaceA')((n) => `A${n}`);
      const fnB = service.memoize<[number], string>('namespaceB')((n) => `B${n}`);

      // Use both caches
      fnA(1);
      fnB(1);

      // Clear just one namespace
      service.clearCache('namespaceA');

      // Get updated stats
      const stats = service.getCacheStats();

      // Only namespaceA should be empty
      expect(stats['namespaceA'].size).toBe(0);
      expect(stats['namespaceB'].size).toBe(1);
    });

    it('should clear all caches', () => {
      // Create and use multiple caches
      const fnA = service.memoize<[number], string>('test1')((n) => `Result ${n}`);
      const fnB = service.memoize<[number], string>('test2')((n) => `Result ${n}`);

      fnA(1);
      fnB(1);

      // Clear all caches
      service.clearAllCaches();

      // Check stats
      const stats = service.getCacheStats();

      // All caches should be empty
      Object.values(stats).forEach(cache => {
        expect(cache.size).toBe(0);
      });
    });
  });
});
