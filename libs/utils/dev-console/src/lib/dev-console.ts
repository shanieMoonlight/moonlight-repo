/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDevMode } from '@angular/core';

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
      console.log(...args);
  },

  /**
   * Logs warning messages to the console in development mode only.
   * @param args Arguments to pass to console.warn
   */
  warn: (...args: any[]): void => {
    if (isDevMode()) 
      console.warn(...args);    
  },

  /**
   * Logs error messages to the console in development mode only.
   * @param args Arguments to pass to console.error
   */
  error: (...args: any[]): void => {
    if (isDevMode()) 
      console.error(...args);    
  },

  /**
   * Creates a group in the console in development mode only.
   * @param label The group label
   */
  group: (label: string): void => {
    if (isDevMode()) 
      console.group(label);    
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