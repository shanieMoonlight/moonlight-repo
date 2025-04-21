import { isDevMode } from '@angular/core';
import { Observable, tap } from 'rxjs';

/**
 * A debug operator that logs values to the console only in development mode.
 * This operator behaves like tap() but only executes in development environments.
 *
 * @param labelOrFormatter Either a string label or a function that transforms the value into a log message
 * @param customLogger Optional custom logging function (defaults to console.log)
 * @returns An operator that conditionally logs in development mode
 * 
 * @example
 * ```typescript
 * // Simple string label
 * source$.pipe(
 *   devLog('User Data')
 * ).subscribe();
 * 
 * // Using a formatter function
 * source$.pipe(
 *   devLog(data => `Got ${data.length} items: ${data[0].name}...`)
 * ).subscribe();
 * ```
 */
export function devLog<T>(
  labelOrFormatter: string | ((value: T) => string),
  customLogger: (message: string, value: T) => void = defaultLogger
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => {
    // Early return same observable if not in dev mode
    if (!isDevMode()) 
      return source;
    

    // Apply tap with logging in dev mode
    return source.pipe(
      tap((value) => {
        let message: string;
        
        // Handle both string labels and formatter functions
        if (typeof labelOrFormatter === 'function') 
          message = labelOrFormatter(value);
        else 
          message = `[${labelOrFormatter}]`;
                
        customLogger(message, value);
      })
    );
  };
}

/**
 * Default logger function that pretty-prints objects
 */
function defaultLogger<T>(message: string, value: T): void {
  console.log(message, value);
}

//-----------------------------//

/**
 * Variant that always shows error messages, but only in dev mode
 */
export function devLogError<T>(
    label?: string
): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => {
        if (!isDevMode()) 
            return source;        

        return source.pipe(
            tap({
                error: (err) => {
                    const prefix = label ? `[${label}]` : '[Error]';
                    console.error(prefix, err);
                }
            })
        );
    };
}

//-----------------------------//