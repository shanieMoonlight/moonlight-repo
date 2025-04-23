# @moonlight/material/theming/service

The core entry point for managing and applying themes in the browser. This library provides the foundational services for storing, generating, and applying themes dynamically. While most users of the library won't need to interact with this directly, developers may find it useful to understand how it works under the hood.

---

## Overview

The `/service` entry point includes two primary services:

1. **`ThemeService`**: Manages theme state, including light/dark mode, custom themes, and persistence.
2. **`ThemeGeneratorService`**: Handles the actual application of themes by generating CSS variables and classes and attaching them to the target element (usually `<html>`).

---

## Features

- **Dynamic Theme Application**: Apply themes dynamically by generating CSS variables and classes.
- **Dark Mode Support**: Toggle between light, dark, or system-preferred modes.
- **Custom Themes**: Add, remove, and manage user-defined themes.
- **Theme Persistence**: Save and restore themes using local storage.
- **Material Design Integration**: Generate Material Design 3 (M3) system variables.
- **Memoization**: Optimize performance by caching generated palettes.

---

## Installation

This entry point is included with the main package:

```bash
npm install @moonlight/ng/theming
```

---

## Usage

### 1. Inject the Services

You can inject the `ThemeService` or `ThemeGeneratorService` into your components or services:

```typescript
import { ThemeService } from '@moonlight/material/theming/service';

@Component({
  selector: 'app-theme-demo',
  template: `<button (click)="toggleDarkMode()">Toggle Dark Mode</button>`
})
export class ThemeDemoComponent {
  constructor(private themeService: ThemeService) {}

  toggleDarkMode() {
    this.themeService.setDarkMode(!this.themeService.isDarkMode());
  }
}
```

### 2. Apply Themes Dynamically

Use the `ThemeGeneratorService` to apply themes programmatically:

```typescript
import { ThemeGeneratorService } from '@moonlight/material/theming/service';
import { ThemeOption } from '@moonlight/material/theming/config';

const theme: ThemeOption = {
  value: 'custom-theme',
  primaryColor: '#6200EE',
  secondaryColor: '#03DAC6',
   darkMode: 'dark'
};

this.themeGeneratorService.applyTheme(theme);
```

---

## API Reference

### `ThemeService`

#### Methods

- **`setDarkMode(darkMode: DarkModeType): void`**: Sets the application's light/dark mode.
- **`setTheme(theme: ThemeOption): void`**: Applies the specified theme.
- **`addCustomTheme(theme: ThemeOption): ThemeOption[]`**: Adds a custom theme to the list of available themes.
- **`removeCustomTheme(value: ThemeValue): ThemeOption[]`**: Removes a custom theme by its value.
- **`resetToDefaults(): void`**: Resets all theme settings to system defaults.
- **`exportThemeSettings(): { theme: ThemeOption, isDark: boolean }`**: Exports the current theme settings.

#### Observables and Signals

- **`isDarkMode$`**: Observable of the current dark mode status.
- **`currentTheme$`**: Observable of the current theme.
- **`customThemes$`**: Observable of user-defined themes.
- **`systemThemes$`**: Observable of developer-defined themes.

### `ThemeGeneratorService`

#### Methods

- **`applyTheme(theme: ThemeOption, themeClassOverride?: string, targetElement?: HTMLElement): void`**: Applies the specified theme to the target element.
- **`exportThemeAsScss(theme: ThemeOption): string`**: Exports the current theme as SCSS variables.

---

## Best Practices

- Use `ThemeService` for managing theme state and user preferences.
- Use `ThemeGeneratorService` for applying themes dynamically in custom scenarios.
- Combine with `@moonlight/material/theming/config` for a complete theming solution.

---

## Related Entry Points

- `@moonlight/material/theming/config` – Theme configuration utilities
- `@moonlight/material/theming/selector` – Theme selection UI component
- `@moonlight/material/theming/components` – Theme/dark mode toggle UI components

---

## License

MIT
