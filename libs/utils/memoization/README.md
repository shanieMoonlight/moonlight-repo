# @spider-baby/utils-memoization

This library provides a `MemoizationService` for Angular applications. It allows you to cache the results of function calls, which can be useful for optimizing performance by avoiding redundant computations.

## Features

-   **Memoize Functions**: Easily create memoized versions of your functions.
-   **Namespace Caching**: Organize caches by namespace to manage different sets of memoized functions.
-   **Cache Size Control**: Set a maximum size for each cache to prevent excessive memory usage.
-   **Cache Clearing**: Clear caches for a specific namespace or all caches globally.
-   **Debug Mode**: Logs cache hits, misses, and evictions to the console during development (when `isDevMode()` is true).
-   **Custom Key Generation**: Optionally provide a custom function to generate cache keys based on function arguments.

## `MemoizationService`

The core of this library is the `MemoizationService`.

### Methods

-   `memoize<Args extends unknown[], R>(namespace: string, options?: MemoizationOptions): MemoizeFactory<Args, R>`:
    Returns a factory function. This factory, when given an original function and an optional key generator, returns a new function that caches its results.
    -   `namespace`: A string identifier for the cache group.
    -   `options`: (Optional) `MemoizationOptions` to configure the cache (e.g., `maxSize`).
        -   `maxSize`: Maximum number of entries to keep in the cache (default: 20).
    -   The returned `MemoizeFactory` takes:
        -   `fn: OriginalFunction<Args, R>`: The function whose results you want to cache.
        -   `keyFn?: KeyGenerator<Args>`: (Optional) A function that generates a unique string key from the arguments of `fn`. If not provided, `JSON.stringify(args)` is used.
    -   The memoized function returned by the factory has the same signature as the original function.

-   `clearCache(namespace: string): void`:
    Clears all cached values for a specific namespace.

-   `clearAllCaches(): void`:
    Clears all caches across all namespaces.

-   `getCacheStats(): Record<string, { size: number, maxSize: number }>`:
    Returns an object containing statistics about the current state of the caches (size and max size for each namespace).

### Usage Example

```typescript
import { Injectable } from '@angular/core';
import { MemoizationService, MemoizedFunction } from '@spider-baby/utils-memoization';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private expensiveCalculationMemoized: MemoizedFunction<[number, number], number>;

  constructor(private memoizationService: MemoizationService) {
    // Create a memoizer for functions within the 'calculations' namespace
    const memoizeCalculation = this.memoizationService.memoize<[number, number], number>('calculations', { maxSize: 10 });

    // Get the memoized version of our expensive function
    this.expensiveCalculationMemoized = memoizeCalculation(this.performExpensiveCalculation);
  }

  private performExpensiveCalculation(a: number, b: number): number {
    console.log('Performing expensive calculation...');
    // Simulate a delay
    for (let i = 0; i < 1e8; i++) {}
    return a + b;
  }

  calculate(a: number, b: number): number {
    // This will use the cached result if available for the given a and b
    return this.expensiveCalculationMemoized(a, b);
  }

  // Example with a custom key generator
  private getUserDataMemoized: MemoizedFunction<[number, string], { id: number, name: string, timestamp: number }>;

  setupUserDataMemoizer() {
    const memoizeUserData = this.memoizationService.memoize<[number, string], { id: number, name: string, timestamp: number }>(
        'userData',
        { maxSize: 50 }
    );

    this.getUserDataMemoized = memoizeUserData(
        (id, type) => this.fetchUserDataFromServer(id, type),
        (id, type) => `user:${id}:${type}` // Custom key generator
    );
  }

  private fetchUserDataFromServer(id: number, type: string): { id: number, name: string, timestamp: number } {
    console.log(`Fetching user data for id ${id}, type ${type} from server...`);
    return { id, name: `User ${id} (${type})`, timestamp: Date.now() };
  }

  getUser(id: number, type: string) {
    return this.getUserDataMemoized(id, type);
  }

  clearUserCache() {
    this.memoizationService.clearCache('userData');
  }

  logCacheStats() {
    console.log(this.memoizationService.getCacheStats());
  }
}

// --- How to use MyService ---
// const service = new MyService(new MemoizationService());
// console.log(service.calculate(5, 10)); // Will log "Performing expensive calculation..."
// console.log(service.calculate(5, 10)); // Will use cached result, no "Performing..." log (if isDevMode() is true, will log "Cache HIT")
// console.log(service.calculate(3, 7));  // Will log "Performing expensive calculation..."

// service.setupUserDataMemoizer();
// console.log(service.getUser(1, 'profile')); // Fetches
// console.log(service.getUser(1, 'profile')); // Cached
// console.log(service.getUser(2, 'profile')); // Fetches
// service.logCacheStats();
// service.clearUserCache();
// console.log(service.getUser(1, 'profile')); // Fetches again after cache clear
// service.logCacheStats();
```

## Type Definitions

-   `MemoizationOptions`: Interface for cache configuration.
    -   `maxSize?: number`: Maximum number of entries.
-   `FunctionCache<T = unknown>`: `Map<string, T>` representing the cache for a single function.
-   `CacheRegistry`: `Map<string, FunctionCache>` representing all caches, namespaced.
-   `KeyGenerator<Args extends unknown[]>`: `(...args: Args) => string`
-   `OriginalFunction<Args extends unknown[], R>`: `(...args: Args) => R`
-   `MemoizedFunction<Args extends unknown[], R>`: `(...args: Args) => R`
-   `MemoizeFactory<Args extends unknown[], R>`: `(fn: OriginalFunction<Args, R>, keyFn?: KeyGenerator<Args>) => MemoizedFunction<Args, R>`

## Running unit tests

Run `nx test utils-memoization` to execute the unit tests (Note: project name might be `sb-utils-memoization` or `utils-memoization` depending on your Nx setup, adjust the command accordingly).
