# @moonlight/material-theming/ui

Secondary entry point of `@moonlight/material-theming`. Import from `@moonlight/material-theming/ui` to use reusable UI components for theming.

---

## Overview

The `/ui` entry point provides reusable Angular Material UI components that are used across the Moonlight theming library. These components are designed to work seamlessly with the theming services and configuration utilities, but they can also be used independently in other applications.

Components included in this entry point:

- **`MlThemeAvatarComponent`**: A visual representation of a theme, displaying its color scheme
- **`MlThemeChipComponent`**: A selectable chip for theme options, showing theme name and colors
- **`MlThemePreviewComponent`**: A small preview of how the theme affects common UI elements
- **`MlThemeComparisonComponent`**: A side-by-side comparison of multiple themes

---

## Features

- **Reusable UI**: Components designed for use in various parts of the Moonlight theming library
- **Material Design**: Built with Angular Material for a consistent look and feel
- **Customizable**: Easily extendable and adaptable for different use cases
- **Dark Mode Support**: All components respond appropriately to light and dark modes
- **Hierarchical Theming**: Components automatically adapt to the current theme context
- **Accessibility**: High-contrast design and proper ARIA attributes

---

## Installation

This entry point is included with the main package:

```bash
npm install @moonlight/material-theming
```

---

## Usage

### Import the Components

Import the UI components you need:

```typescript
import { 
  MlThemeAvatarComponent, 
  MlThemeChipComponent,
  MlThemePreviewComponent,
  MlThemeComparisonComponent
} from '@moonlight/material-theming/ui';

@Component({
  // For standalone components
  imports: [
    MlThemeAvatarComponent, 
    MlThemeChipComponent,
    MlThemePreviewComponent,
    MlThemeComparisonComponent
  ],
  // ...
})
export class YourComponent {}
```

### Theme Avatar Example

Display a visual representation of a theme:

```html
<ml-theme-avatar 
  [theme]="selectedTheme"
  [size]="'medium'"
  [showLabel]="true">
</ml-theme-avatar>
```

### Theme Chip Example

Create selectable theme chips:

```html
<ml-theme-chip
  *ngFor="let theme of availableThemes"
  [theme]="theme"
  [selected]="theme.value === selectedTheme.value"
  (click)="selectTheme(theme)">
</ml-theme-chip>
```

### Theme Preview Example

Show a preview of how the theme affects UI elements:

```html
<ml-theme-preview 
  [theme]="previewTheme"
  [darkMode]="'light'">
</ml-theme-preview>
```

### Theme Comparison Example

Compare multiple themes side by side:

```html
<ml-theme-comparison
  [themes]="[themeA, themeB]"
  [labels]="['Before', 'After']">
</ml-theme-comparison>
```

---

## Component API

### `MlThemeAvatarComponent`

Displays a visual representation of a theme.

#### Inputs

- `[theme]`: `ThemeOption` - The theme to display
- `[size]`: `'small' | 'medium' | 'large'` - Size of the avatar. Default: `'medium'`
- `[showLabel]`: `boolean` - Whether to show the theme name. Default: `false`
- `[circular]`: `boolean` - Whether to use a circular avatar. Default: `true`

### `MlThemeChipComponent`

A selectable chip for theme options.

#### Inputs

- `[theme]`: `ThemeOption` - The theme to display
- `[selected]`: `boolean` - Whether the chip is selected. Default: `false`
- `[disabled]`: `boolean` - Whether the chip is disabled. Default: `false`

#### Outputs

- `(themeSelected)`: `EventEmitter<ThemeOption>` - Emitted when the chip is selected

### `MlThemePreviewComponent`

A small preview showing how the theme affects common UI elements.

#### Inputs

- `[theme]`: `ThemeOption` - The theme to preview
- `[darkMode]`: `'light' | 'dark' | 'system'` - Force a specific mode. Default: `'system'`
- `[elements]`: `string[]` - Which elements to include in the preview. Default: `['button', 'card', 'input']`

### `MlThemeComparisonComponent`

A side-by-side comparison of multiple themes.

#### Inputs

- `[themes]`: `ThemeOption[]` - Themes to compare
- `[labels]`: `string[]` - Labels for each theme. Default: theme names
- `[darkMode]`: `'light' | 'dark' | 'system'` - Force a specific mode. Default: `'system'`

---

## Integration with Hierarchical Theming

The UI components automatically adapt to the current theme context when used with hierarchical theming. For example, in a section with section-specific themes:

```typescript
import { Component, OnDestroy } from '@angular/core';
import { DynamicThemeConfigService, ThemeOption } from '@moonlight/material-theming/config';
import { MlThemeChipComponent } from '@moonlight/material-theming/ui';

@Component({
  selector: 'app-feature-section',
  template: `
    <h2>Section-Specific Themes</h2>
    <div class="theme-options">
      <ml-theme-chip 
        *ngFor="let theme of availableThemes()" 
        [theme]="theme"
        [selected]="isSelected(theme)"
        (themeSelected)="selectTheme($event)">
      </ml-theme-chip>
    </div>
  `,
  imports: [MlThemeChipComponent],
  standalone: true
})
export class FeatureSectionComponent implements OnDestroy {
  constructor(private themeConfig: DynamicThemeConfigService) {
    // Set section-specific themes
    this.themeConfig.setSystemThemes([
      // Feature-specific themes...
    ]);
  }
  
  ngOnDestroy() {
    // Reset to original themes when leaving
    this.themeConfig.resetSystemThemesToInitial();
  }
}
```

The UI components will automatically show the section-specific themes rather than the global themes.

---

## Best Practices

- Use `MlThemeAvatarComponent` in theme pickers, dialogs, or any UI where a visual representation of a theme is needed
- Use `MlThemeChipComponent` for theme selection interfaces that need more visual information than a standard select
- Use `MlThemePreviewComponent` to give users a quick glimpse of how a theme will look without applying it
- Use `MlThemeComparisonComponent` when redesigning themes to visualize the changes
- Group related UI components together for a more cohesive theming experience

---

## Related Entry Points

- `@moonlight/material-theming/customizer` – Theme selection and customization UI components
- `@moonlight/material-theming/components` – Theme/dark mode toggle UI components
- `@moonlight/material-theming/service` – Core theme generation and application services
- `@moonlight/material-theming/showcase` – Components for theme showcases

---

## License

MIT
