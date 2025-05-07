# @spider-baby/dev-console

[![npm version](https://img.shields.io/npm/v/@spider-baby/dev-console.svg)](https://www.npmjs.com/package/@spider-baby/dev-console)
[![license](https://img.shields.io/npm/l/@spider-baby/dev-console.svg)](LICENSE)
[![Angular Compatibility](https://img.shields.io/badge/Angular-12%2B-brightgreen)](https://www.npmjs.com/package/@spider-baby/dev-console)

A simple utility for Angular that wraps standard `console` methods (`log`, `warn`, `error`, etc.) to ensure they only execute during development mode (when `isDevMode()` from `@angular/core` is true). This helps keep production console output clean.

## Overview

In Angular development, you often add `console.log` statements for debugging. Forgetting to remove them can clutter the console in production builds. This utility provides a `devConsole` object with the same methods as the standard `console`, but they automatically become no-ops in production builds.

## Installation

```bash
npm install @spider-baby/dev-console
```

Compatible with Angular 12 and higher.

## Usage

Import `devConsole` into your Angular components, services, or other files.

```typescript
import { Component } from '@angular/core';
import { devConsole } from '@spider-baby/dev-console';
// Or: import devConsole from '@spider-baby/dev-console';

@Component({
  selector: 'app-my-component',
  template: `<button (click)="doSomething()">Do Something</button>`
})
export class MyComponent {

  doSomething() {
    const data = { id: 1, name: 'Example' };
    
    devConsole.log('Button clicked!', data); 
    // This will only log in development mode

    devConsole.warn('This is a development warning.');
    // This will only warn in development mode

    devConsole.error('Simulating a dev-only error log.');
    // This will only error log in development mode

    devConsole.group('User Details');
    devConsole.log('Name: John Doe');
    devConsole.table([{ id: 1, role: 'Admin' }, { id: 2, role: 'User' }]);
    devConsole.groupEnd();
    // Grouping and table only happen in development mode

    devConsole.time('Data Processing');
    // ... some operations ...
    devConsole.timeEnd('Data Processing');
    // Timer logs only happen in development mode
  }
}
```

## API

The `devConsole` object provides the following methods, mirroring the standard `console` API but only active when `isDevMode()` returns `true`:

- `devConsole.log(...args: any[])`
- `devConsole.warn(...args: any[])`
- `devConsole.error(...args: any[])`
- `devConsole.group(label: string)`
- `devConsole.groupEnd()`
- `devConsole.table(tabularData: any, properties?: string[])`
- `devConsole.time(label: string)`
- `devConsole.timeEnd(label: string)`

## License

MIT