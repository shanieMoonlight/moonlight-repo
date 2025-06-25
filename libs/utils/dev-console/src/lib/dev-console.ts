/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDevMode } from '@angular/core';

//########################################//

  const skipPatterns = [
    'dev-console',
    'getCallerLine',
    'Object.log',
    'Object.warn',
    'Object.error',
    'Object.group',
    'Object.groupEnd',
    'Object.table',
    'Object.time',
    'Object.timeEnd',
    'Object.trace',
    'zone.js',           // Angular zone.js
    'core.js',           // Angular core
    'polyfills.js',      // Angular polyfills
    'webpack',           // Webpack runtime
    // 'chunk-',            // Vite/Webpack chunk files
    'node_modules',      // Any node_modules code
    // Add more as needed for your stack/environment
  ];

function getCallerLine(): string {
  const err = new Error()
  const stack = err.stack?.split('\n')
  if (!stack) 
    return ''

  // Start from index 1 to skip the "Error" line
  for (let i = 1; i < stack.length; i++) {
    const line = stack[i]
    if (!skipPatterns.some(pattern => line.includes(pattern))) 
      return line.trim()
  }

  return ''
}

//########################################//

/**
 * Development-only logging utilities.
 * These methods behave like their console counterparts,
 * but only execute in development mode (when isDevMode() is true).
 */
export const devConsole = {
  /**
   * Logs messages to the console in development mode only.
   * @param args Arguments to pass to console.log
   */
  log: (...args: any[]): void => {
    if (isDevMode()) 
    console.log(...args, getCallerLine());
  },

  /**
   * Logs warning messages to the console in development mode only.
   * @param args Arguments to pass to console.warn
   */
  warn: (...args: any[]): void => {
    if (isDevMode()) 
      console.warn(...args, getCallerLine());    
  },

  /**
   * Logs error messages to the console in development mode only.
   * @param args Arguments to pass to console.error
   */
  error: (...args: any[]): void => {
    if (isDevMode()) 
      console.error(...args, getCallerLine());    
  },

  /**
   * Creates a group in the console in development mode only.
   * @param label The group label
   */
  group: (label: string): void => {
    if (isDevMode()) 
      console.group(label, getCallerLine());    
  },

  /**
   * Ends the current console group in development mode only.
   */
  groupEnd: (): void => {
    if (isDevMode()) 
      console.groupEnd();    
  },

  /**
   * Logs objects with a formatted table in development mode only.
   * @param tabularData The data to display
   * @param properties Optional array of property names to include
   */
  table: (tabularData: any, properties?: string[]): void => {
    if (isDevMode()) 
      console.table(tabularData, properties);
  },

  /**
   * Creates a timer in development mode only.
   * @param label Timer label
   */
  time: (label: string): void => {
    if (isDevMode()) 
      console.time(label);
  },

  /**
   * Log the stack trace
   */
  trace: (): void => {
    if (isDevMode()) 
      console.trace();
  },

  /**
   * Ends a timer in development mode only and logs the elapsed time.
   * @param label Timer label
   */
  timeEnd: (label: string): void => {
    if (isDevMode()) 
      console.timeEnd(label);
  }
};

// Export as default and named export for convenience
export default devConsole;