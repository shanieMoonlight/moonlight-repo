# @moonlight/material/theming/utils

This entry point provides internal utility services and helper functions for the Moonlight theming library. These utilities are primarily used by the core services, such as `ThemeGeneratorService`, to handle color manipulation, system preferences, and other theming-related tasks.

---

## Overview

The `/utils` entry point is designed for internal use within the Moonlight theming library. It includes:

- **Color Utilities**: Functions for manipulating and converting colors (e.g., RGB, HEX).
- **System Preferences**: Detect system-level dark mode preferences.
- **Reusable Helpers**: Shared logic for theming-related operations.

While these utilities are not typically used directly by library consumers, they are essential for the functionality of the theming services.

---

## Features

- **Color Manipulation**: Extract and convert colors between formats (e.g., HEX to RGB).
- **CSS Variable Management**: Set CSS variables dynamically for themes.
- **System Dark Mode Detection**: Respect user system preferences for light/dark mode.

---

## Installation

This entry point is included with the main package:

```bash
npm install @moonlight/ng/theming
```

---

## Usage

These utilities are primarily used internally by the library. However, developers extending the library or creating custom theming solutions may find them useful.

### Example: Using `ColorUtilsService`

```typescript
import { ColorUtilsService } from '@moonlight/material/theming/utils';

@Component({
  selector: 'app-color-demo',
  template: `<div [style.backgroundColor]="backgroundColor">Demo</div>`
})
export class ColorDemoComponent {
  backgroundColor: string;

  constructor(private colorUtils: ColorUtilsService) {
    this.backgroundColor = this.colorUtils.toHex([255, 0, 0]); // Convert RGB to HEX
  }
}
```

---

## API Reference

### `ColorUtilsService`

#### Methods

- **`extractRGB(hexColor: string): [number, number, number]`**: Extracts RGB components from a HEX color.
- **`getRGBString(hexColor: string): string`**: Returns RGB values as a comma-separated string for CSS.
- **`getRGBA(hexColor: string, alpha: number): string`**: Returns a CSS `rgba()` value with the specified alpha.
- **`setRGBVariable(element: HTMLElement, variableName: string, hexColor: string): void`**: Sets an RGB CSS variable on the specified element.

### `SystemPrefsService`

#### Methods

- **`prefersDarkMode(): boolean`**: Returns `true` if the system is set to dark mode, `false` otherwise.

---

## Best Practices

- Use `ColorUtilsService` for consistent color manipulation across your application.
- Use `SystemPrefsService` to respect user system preferences for light/dark mode.
- Combine these utilities with `@moonlight/material/theming/service` for a complete theming solution.

---

## Related Entry Points

- `@moonlight/material/theming/service` – Core theme generation and application services
- `@moonlight/material/theming/config` – Theme configuration utilities
- `@moonlight/material/theming/selector` – Theme selection UI component

---

## License

MIT
