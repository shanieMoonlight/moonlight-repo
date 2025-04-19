import { Injectable, isDevMode } from '@angular/core';

//##################################################//

/**
 * Options for configuring a memoization cache
 */
export interface MemoizationOptions {
  /** Maximum number of entries to keep in the cache (default: 20) */
  maxSize?: number;
}

/**
 * Cache for storing results of a specific function
 * @template T Type of values stored in the cache
 */
export type FunctionCache<T = unknown> = Map<string, T>;

/**
 * Namespace-organized collection of function caches
 */
export type CacheRegistry = Map<string, FunctionCache>;

//#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-//

/**
 * Function that generates a cache key from function arguments
 */
export type KeyGenerator<Args extends unknown[]> = (...args: Args) => string;

/**
 * Original function that will be memoized
 */
export type OriginalFunction<Args extends unknown[], R> = (...args: Args) => R;

/**
 * Memoized version of a function with same signature as original
 */
export type MemoizedFunction<Args extends unknown[], R> = (...args: Args) => R;

/**
 * Factory that creates memoized versions of functions
 */
export type MemoizeFactory<Args extends unknown[], R> =
  (fn: OriginalFunction<Args, R>, keyFn?: KeyGenerator<Args>) => MemoizedFunction<Args, R>;

//##################################################//

@Injectable({
  providedIn: 'root'
})
export class MemoizationService {

  // Use unknown for better type safety
  private caches: CacheRegistry = new Map<string, FunctionCache>();
  private debug = isDevMode();

  //-----------------------------//

  /**
   * Creates a memoized version of a function with support for multiple arguments
   * @param namespace Identifier for the cache group
   * @param options Configuration options
   * @returns A function factory that creates memoized versions of functions
   */
  memoize<Args extends unknown[], R>(namespace: string, options: MemoizationOptions = {}): MemoizeFactory<Args, R> {

    const maxSize = options.maxSize ?? 20;

    const cache = this.getOrCreateCache(namespace);

    // Return a function factory
    return (fn: OriginalFunction<Args, R>, keyFn?: KeyGenerator<Args>): MemoizedFunction<Args, R> => {

      // Return the memoized function
      return (...args: Args): R => {
        // Get cache key - either using provided key function or JSON stringify
        const cacheKey = keyFn ? keyFn(...args) : JSON.stringify(args);

        // Check for cache hit
        if (cache.has(cacheKey)) {
          if (this.debug)
            console.log(`Cache HIT for ${namespace}:${cacheKey}`);
          return cache.get(cacheKey) as R;
        }

        if (this.debug)
          console.log(`Cache MISS for ${namespace}:${cacheKey}`);

        // Calculate result
        const result = fn(...args);

        // Store in cache
        cache.set(cacheKey, result);

        // Manage cache size
        if (cache.size > maxSize)
          this.removeOldestentry(cache, namespace);

        return result;
      };
    };
  }

  //-----------------------------//

  /**
   * Clears all cached values for a specific namespace
   */
  clearCache(namespace: string): void {
    this.caches.get(namespace)?.clear()
  }

  //-----------------------------//

  /**
   * Clears all caches across all namespaces
   */
  clearAllCaches(): void {
    this.caches.forEach(cache => cache.clear())
  }

  //-----------------------------//

  /**
   * Gets statistics about the memoization caches
   */
  getCacheStats(): Record<string, { size: number, maxSize: number }> {
    const stats: Record<string, { size: number, maxSize: number }> = {};

    this.caches.forEach((cache, namespace) => {
      stats[namespace] = {
        size: cache.size,
        maxSize: 20 // You would need to store this per namespace to be accurate
      };
    });

    return stats;
  }

  //-----------------------------//

  private getOrCreateCache(namespace: string): FunctionCache {
    let cache = this.caches.get(namespace);
    if (!cache) {
      cache = new Map<string, unknown>();
      this.caches.set(namespace, cache);
    }
    return cache;
  }

  //- - - - - - - - - - - - - - -//

  private removeOldestentry(cache: FunctionCache, namespace: string): void {

    const oldestKey = cache.keys().next().value
    if (this.debug)
      console.log(`Cache EVICT for ${namespace}:${oldestKey}`);
    if (oldestKey)
      cache.delete(oldestKey)

  }

  //-----------------------------//

}//Cls