# @spider-baby/utils-common

A collection of general-purpose TypeScript utility functions for use across your Nx monorepo. This library provides helpers for dates, strings, numbers, and collections, organized into secondary entrypoints for optimal tree-shaking and modular imports.

## Features

- **Dates:** Date formatting, parsing, and calculations
- **Strings:** String manipulation and type guards
- **Numbers:** Type guards and numeric utilities
- **Collections:** Set utilities and more

## Usage

Import from the main entrypoint to access all utilities:
```typescript
import { isNumber, StringHelpers, DateHelpers } from '@spider-baby/utils-common';
```

Or import from a specific secondary entrypoint for better tree-shaking:
```typescript
import { SetUtility } from '@spider-baby/utils-common/collections';
import { isNumber } from '@spider-baby/utils-common/numbers';
```

## Testing

Run unit tests with:
```sh
nx test utils-common
```
