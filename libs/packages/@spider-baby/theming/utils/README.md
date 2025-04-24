# @spider-baby/material-theming/utils

This entry point provides utility services and helper functions for the SpiderBaby theming library. While these utilities are primarily used by the core services, advanced users may find them useful for custom theming implementations.

---

## Overview

The `/utils` entry point includes:

- **Color Utilities**: Functions for manipulating and converting colors (RGB, HEX, HSL)
- **System Preferences**: Detect system-level dark mode preferences and changes
- **Debugging Tools**: Controlled console output for theme development
- **Material Modules**: Convenient module imports for Material components
- **Memoization Helpers**: Performance optimization through caching

These utilities form the foundation of the theming system's ability to generate and apply themes efficiently.

---

## Features

- **Color Manipulation**: Convert between color formats and create harmonious color palettes
- **CSS Variable Management**: Set and manage CSS variables for theme application
- **System Dark Mode Detection**: Observe changes to system color scheme preferences
- **Controlled Debugging**: Output debug information only in development environments
- **Performance Optimization**: Cache expensive color calculations for better performance

---

## Installation

This entry point is included with the main package:

```bash
npm install @spider-baby/material-theming
```

---

## Usage

### Color Utilities

The `ColorUtilsService` provides methods for working with colors in various formats:

```typescript
import { ColorUtilsService } from '@spider-baby/material-theming/utils';

@Component({
  // ...
})
export class ThemeHelperComponent {
  constructor(private colorUtils: ColorUtilsService) {
    // Convert HEX to RGB
    const rgbArray = this.colorUtils.extractRGB('#3F51B5');
    console.log(rgbArray); // [63, 81, 181]
    
    // Get CSS RGB string
    const rgbString = this.colorUtils.getRGBString('#3F51B5');
    console.log(rgbString); // '63, 81, 181'
    
    // Create RGBA value with opacity
    const rgbaColor = this.colorUtils.getRGBA('#3F51B5', 0.5);
    console.log(rgbaColor); // 'rgba(63, 81, 181, 0.5)'
    
    // Set RGB CSS variables
    const element = document.querySelector('.my-element');
    if (element) {
      this.colorUtils.setRGBVariable(
        element as HTMLElement, 
        '--my-color-rgb', 
        '#3F51B5'
      );
      // Sets variable that can be used like: rgba(var(--my-color-rgb), 0.5)
    }
  }
}
```

### System Preferences Detection

The `SystemPrefsService` allows you to detect and observe system dark mode preferences:

```typescript
import { SystemPrefsService } from '@spider-baby/material-theming/utils';

@Component({
  // ...
})
export class ThemeAwareComponent implements OnInit {
  isDarkMode = false;
  
  constructor(private systemPrefs: SystemPrefsService) {}
  
  ngOnInit() {
    // Get current preference
    this.isDarkMode = this.systemPrefs.prefersDarkMode();
    
    // Subscribe to changes
    this.systemPrefs.prefersDarkMode$.subscribe(prefersDark => {
      console.log('System preference changed:', prefersDark ? 'dark' : 'light');
      this.isDarkMode = prefersDark;
    });
  }
}
```

### Debugging Tools

The `consoleDev` utility provides controlled console output that only appears in development environments:

```typescript
import { consoleDev } from '@spider-baby/material-theming/utils';

// These will only appear in development, not production
consoleDev.log('Theme debug info:', themeDetails);
consoleDev.warn('Theme warning:', potentialIssue);
consoleDev.error('Theme error:', errorDetails);
```

---

## API Reference

### `ColorUtilsService`

#### Methods

- **`extractRGB(hexColor: string): [number, number, number]`**: Extracts RGB components from a HEX color
- **`getRGBString(hexColor: string): string`**: Returns RGB values as a comma-separated string for CSS
- **`getRGBA(hexColor: string, alpha: number): string`**: Returns a CSS `rgba()` value
- **`setRGBVariable(element: HTMLElement, variableName: string, hexColor: string): void`**: Sets an RGB CSS variable
- **`lightenColor(hexColor: string, amount: number): string`**: Creates a lighter version of a color
- **`darkenColor(hexColor: string, amount: number): string`**: Creates a darker version of a color
- **`getContrastColor(hexColor: string): string`**: Gets a contrasting color (black or white) for text

### `SystemPrefsService`

#### Properties

- **`prefersDarkMode$: Observable<boolean>`**: Observable that emits when system dark mode preference changes

#### Methods

- **`prefersDarkMode(): boolean`**: Returns current system dark mode preference

### `consoleDev`

Debug utility that only outputs messages in development environments:

- **`log(...args: any[]): void`**: Development-only console.log
- **`warn(...args: any[]): void`**: Development-only console.warn
- **`error(...args: any[]): void`**: Development-only console.error
- **`info(...args: any[]): void`**: Development-only console.info

### `MatEverythingModule`

A convenience module that imports and exports common Angular Material modules:

```typescript
import { MatEverythingModule } from '@spider-baby/material-theming/utils';

@NgModule({
  imports: [
    MatEverythingModule
    // Instead of importing each Material module separately
  ]
})
export class YourModule {}
```

---

## Advanced Usage: Creating Custom Theme Palettes

For more advanced applications, you can use the color utilities to create custom theme palettes:

```typescript
import { ColorUtilsService } from '@spider-baby/material-theming/utils';

@Injectable()
export class CustomPaletteService {
  constructor(private colorUtils: ColorUtilsService) {}
  
  createPalette(baseColor: string): Record<number, string> {
    // Create a palette with various shades
    return {
      50: this.colorUtils.lightenColor(baseColor, 0.85),
      100: this.colorUtils.lightenColor(baseColor, 0.7),
      200: this.colorUtils.lightenColor(baseColor, 0.5),
      300: this.colorUtils.lightenColor(baseColor, 0.3),
      400: this.colorUtils.lightenColor(baseColor, 0.15),
      500: baseColor, // Base color
      600: this.colorUtils.darkenColor(baseColor, 0.15),
      700: this.colorUtils.darkenColor(baseColor, 0.3),
      800: this.colorUtils.darkenColor(baseColor, 0.5),
      900: this.colorUtils.darkenColor(baseColor, 0.7)
    };
  }
}
```

---

## Best Practices

- Use `ColorUtilsService` for consistent color manipulation across your application
- Create RGB CSS variables for elements that need alpha transparency
- Use `prefersDarkMode$` observable to respond to system preference changes
- Keep console output controlled using `consoleDev` instead of direct console methods
- Use the memoization utilities for performance-critical color calculations

---

## Related Entry Points

- `@spider-baby/material-theming/service` – Core theme generation and application services
- `@spider-baby/material-theming/config` – Theme configuration utilities
- `@spider-baby/material-theming/components` – Theme UI components
- `@spider-baby/material-theming/customizer` – Theme selection and customization UI

---

## License

MIT
