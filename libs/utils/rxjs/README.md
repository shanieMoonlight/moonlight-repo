# sb-utils-rxjs

This library was generated with [Nx](https://nx.dev).

This library provides utility operators for RxJS Observables, primarily for debugging purposes during development.

## Operators

### `devLog`

A debug operator that logs emitted values from an Observable to the console, but only when the application is running in development mode. This operator behaves like `tap()` but its logging action is conditional based on `isDevMode()` from `@angular/core`.

**Parameters:**

*   `labelOrFormatter` (string | (value: T) => string):
    *   If a string is provided, it's used as a label prefix for the logged message (e.g., `[User Data]`).
    *   If a function is provided, it receives the emitted value and should return a string to be logged. This allows for custom message formatting.
*   `customLogger` ((message: string, value: T) => void) (optional):
    *   A custom function to handle the logging. Defaults to `console.log`, which will log the message string and the value itself.

**Returns:**

*   `(source: Observable<T>) => Observable<T>`: An RxJS operator function.

**Usage Examples:**

```typescript
import { devLog } from '@spider-baby/utils-rxjs'; // Adjust import path as necessary

// Example 1: Using a simple string label
source$.pipe(
  devLog('User Data')
).subscribe();
// In dev mode, might log: "[User Data]" { /* emitted value */ }

// Example 2: Using a formatter function
source$.pipe(
  devLog(data => `Received ${data.items.length} items. First item: ${data.items[0]?.name}`)
).subscribe();
// In dev mode, might log: "Received 5 items. First item: ExampleName" { /* emitted value */ }

// Example 3: Using a custom logger
source$.pipe(
  devLog('API Response', (message, value) => {
    console.group(message);
    console.log('Value:', value);
    console.groupEnd();
  })
).subscribe();
```

### `devLogError`

A debug operator that logs errors from an Observable to the console, but only when the application is running in development mode. This is useful for tapping into the error channel of an Observable for debugging without adding permanent error handling logic.

**Parameters:**

*   `label` (string) (optional):
    *   A string label to prefix the error message (e.g., `[API Error]`). Defaults to `[Error]` if not provided.

**Returns:**

*   `(source: Observable<T>) => Observable<T>`: An RxJS operator function.

**Usage Example:**

```typescript
import { devLogError } from '@spider-baby/utils-rxjs'; // Adjust import path as necessary

sourceThatMightError$.pipe(
  devLogError('Data Fetch Operation')
).subscribe({
  next: data => console.log('Data:', data),
  // No error callback needed here for logging in dev mode,
  // but you'd typically have one for production error handling.
});
// In dev mode, if an error occurs, might log: "[Data Fetch Operation]" { /* error object */ }
```

## Running unit tests

Run `nx test @spider-baby/utils-rxjs` to execute the unit tests via [Jest](https://jestjs.io).
