# @spider-baby/material-theming/service

The core entry point for managing and applying themes in the browser. This library provides the foundational services for storing, generating, and applying themes dynamically. While most users of the library won't need to interact with this directly, developers may find it useful to understand how it works under the hood.

---

## Overview

The `/service` entry point includes three primary services:

1. **`ThemeService`**: Manages theme state, including light/dark mode, custom themes, and persistence.
2. **`ThemeGeneratorService`**: Handles the actual application of themes by generating CSS variables and classes and attaching them to the target element (usually `<html>`).
3. **`ThemeTransitionService`**: Manages smooth transitions between themes using overlay or morphing techniques.

---

## Features

- **Dynamic Theme Application**: Apply themes dynamically by generating CSS variables and classes.
- **Dark Mode Support**: Toggle between light, dark, or system-preferred modes.
- **Custom Themes**: Add, remove, and manage user-defined themes.
- **Theme Persistence**: Save and restore themes using local storage.
- **Material Design Integration**: Generate Material Design 3 (M3) system variables.
- **Memoization**: Optimize performance by caching generated palettes.
- **Smooth Transitions**: Create visually pleasing transitions between themes.
- **Hierarchical Theming**: Support for different theme contexts in different parts of your application.

---

## Installation

This entry point is included with the main package:

```bash
npm install @spider-baby/ng/theming
```

---

## Usage

### 1. Inject the Services

You can inject the services into your components:

```typescript
import { ThemeService, ThemeTransitionService } from '@spider-baby/material-theming/service';

@Component({
  selector: 'app-theme-demo',
  template: `<button (click)="toggleDarkMode()">Toggle Dark Mode</button>`
})
export class ThemeDemoComponent {
  constructor(
    private themeService: ThemeService,
    private transitionService: ThemeTransitionService
  ) {}

  toggleDarkMode() {
    this.themeService.setDarkMode(
      this.themeService.isDarkMode() ? 'light' : 'dark'
    );
  }
}
```

### 2. Apply Themes Dynamically

Use the `ThemeGeneratorService` to apply themes programmatically:

```typescript
import { ThemeGeneratorService } from '@spider-baby/material-theming/service';
import { ThemeOption } from '@spider-baby/material-theming/config';

@Component({
  selector: 'app-theme-preview',
  template: `<div #previewContainer>Preview content here</div>`
})
export class ThemePreviewComponent {
  @ViewChild('previewContainer') container!: ElementRef;
  
  constructor(private themeGenerator: ThemeGeneratorService) {}
  
  previewTheme(theme: ThemeOption): void {
    // Apply theme only to this component
    this.themeGenerator.applyTheme(
      theme,
      undefined,
      this.container.nativeElement
    );
  }
}
```

### 3. Use Theme Transitions

For custom theme transition effects:

```typescript
import { ThemeTransitionService } from '@spider-baby/material-theming/service';
import { ThemeOption } from '@spider-baby/material-theming/config';

@Component({
  selector: 'app-theme-switcher',
  template: `<button (click)="switchThemes()">Switch Between Themes</button>`
})
export class ThemeSwitcherComponent {
  private themes: ThemeOption[] = [...]; // Your themes
  private currentIndex = 0;
  
  constructor(private transitionService: ThemeTransitionService) {}
  
  switchThemes(): void {
    const oldTheme = this.themes[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.themes.length;
    const newTheme = this.themes[this.currentIndex];
    
    // Manually trigger a transition between themes
    this.transitionService.transitionThemes(oldTheme, newTheme);
  }
}
```

---

## API Reference

### `ThemeService`

#### Methods

- **`setDarkMode(darkMode: DarkModeType): void`**: Sets the application's light/dark mode.
- **`setTheme(theme: ThemeOption): void`**: Sets the current theme.
- **`setThemeByValue(themeValue: ThemeValue): boolean`**: Sets a theme by its value.
- **`applyTheme(theme: ThemeOption, targetElement?: HTMLElement): void`**: Applies a theme to an element.
- **`addCustomTheme(theme: ThemeOption): ThemeOption[]`**: Adds a custom theme.
- **`removeCustomTheme(value: ThemeValue): ThemeOption[]`**: Removes a custom theme.
- **`resetToDefaults(): void`**: Resets all theme settings to system defaults.
- **`refreshTheme(): void`**: Refreshes the theme by reapplying stored theme data.
- **`exportThemeSettings(): { theme: ThemeOption, isDark: boolean }`**: Exports current theme settings.

#### Signals and Observables

- **`isDarkMode`**: Signal of the current dark mode status.
- **`isDarkMode$`**: Observable of the current dark mode status.
- **`currentTheme`**: Signal of the current theme.
- **`currentTheme$`**: Observable of the current theme.
- **`customThemes`**: Signal of user-defined themes.
- **`customThemes$`**: Observable of user-defined themes.
- **`systemThemes`**: Signal of developer-defined themes.
- **`systemThemes$`**: Observable of developer-defined themes.
- **`availableThemes`**: Signal of all available themes.
- **`availableThemes$`**: Observable of all available themes.

### `ThemeGeneratorService`

#### Methods

- **`applyTheme(theme: ThemeOption, themeClassOverride?: ThemeValue, targetElement?: HTMLElement): void`**: Applies the specified theme to the target element.

### `ThemeTransitionService`

#### Methods

- **`transitionThemes(fromTheme: ThemeOption | null, toTheme: ThemeOption, darkMode?: DarkModeType): void`**: Transitions from one theme to another with an animated effect.
- **`setTransitionOptions(options: ThemeTransitionOptions): void`**: Updates transition settings.

#### Properties

- **`isTransitioning$`**: Observable indicating whether a transition is in progress.
- **`isTransitioning`**: Signal indicating whether a transition is in progress.

---

## How Theme Transitions Work

The `ThemeTransitionService` supports two main transition styles:

### Overlay Transition
- Creates a temporary overlay layer that fades in/out during theme changes
- Good for dramatic theme changes with high contrast differences
- Provides a clear visual break between themes

### Morph Transition
- Smoothly animates all color values directly from old theme to new theme
- Creates a fluid, natural feel for theme switching
- Better for subtle theme changes or related color schemes

Transitions are configured through the `transitionOptions` property in your theme configuration:

```typescript
import { ThemingConfig } from '@spider-baby/material-theming/config';

export const THEME_CONFIG = ThemingConfig.create({
  // Theme options...
  transitionOptions: {
    style: 'morph', // or 'overlay'
    duration: 400,  // milliseconds
    showTransitions: true
  }
});
```

## Hierarchical Theme Management

One of the most powerful features of this library is the ability to create theme hierarchies, where different sections of your application can have different available themes:

```typescript
import { Component, OnDestroy } from '@angular/core';
import { DynamicThemeConfigService } from '@spider-baby/material-theming/config';
import { ThemeOption } from '@spider-baby/material-theming/config';

@Component({
  selector: 'app-feature-section',
  template: `<router-outlet></router-outlet>`
})
export class FeatureSectionComponent implements OnDestroy {
  constructor(private dynamicConfig: DynamicThemeConfigService) {
    // Set section-specific themes
    this.dynamicConfig.setSystemThemes([
      ThemeOption.create({
        value: 'feature-theme-1',
        label: 'Feature Theme 1',
        primaryColor: '#2196f3',
        secondaryColor: '#ff9800'
      }),
      ThemeOption.create({
        value: 'feature-theme-2',
        label: 'Feature Theme 2',
        primaryColor: '#673ab7',
        secondaryColor: '#4caf50'
      })
    ]);
  }
  
  ngOnDestroy(): void {
    // Restore original themes when leaving this section
    this.dynamicConfig.resetSystemThemesToInitial();
  }
}
```

When a user navigates to this section, they'll only see the feature-specific themes. When they navigate away, the original app-wide themes will be restored.

---

## Best Practices

- Use `ThemeService` for managing theme state and user preferences.
- Use `ThemeGeneratorService` for applying themes dynamically in custom scenarios.
- Use `ThemeTransitionService` for custom transition effects between themes.
- Create modular theming hierarchies for combined applications with distinct sections.
- Combine with `@spider-baby/material-theming/config` for a complete theming solution.

---

## Related Entry Points

- `@spider-baby/material-theming/config` – Theme configuration utilities
- `@spider-baby/material-theming/customizer` – Theme selection UI component
- `@spider-baby/material-theming/components` – Theme/dark mode toggle UI components

---

## License

MIT
