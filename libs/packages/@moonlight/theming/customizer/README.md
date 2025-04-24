# @moonlight/material-theming/customizer

Secondary entry point of `@moonlight/material-theming`. Import from `@moonlight/material-theming/customizer` to use the theme selector and customization UI components.

---

## Overview

The `/customizer` entry point provides the `MlThemeSelectorComponent`, a powerful and user-friendly Angular Material UI for creating, previewing, and managing application themes. It allows users to:

- Select and preview preset themes
- Customize primary, secondary, tertiary, and error colors
- Choose light, dark, or system theme modes
- Name and save custom themes
- Instantly preview theme changes in the browser
- Export theme settings for reuse

This component is ideal for applications that want to offer end-users or developers a rich theme customization experience.

---

## Features

- **Material Design**: Built with Angular Material for a modern look and feel
- **Live Preview**: Instantly applies theme changes to the application for real-time feedback
- **Preset Themes**: Quickly preview and select from a set of predefined themes
- **Custom Theme Creation**: Users can create, name, and save their own themes
- **Color Pickers**: Easy-to-use color inputs for all theme colors
- **Dark/Light/System Mode**: Toggle between light, dark, or system-preferred color schemes
- **Theme Export**: Export theme settings for saving or sharing
- **Accessibility**: Keyboard and screen reader friendly

---

## Installation

This entry point is included with the main package:

```bash
npm install @moonlight/material-theming
```

---

## Usage

### 1. Import the Component

Add the customizer component to your feature module or as a standalone component:

```typescript
import { ThemeSelectorComponent } from '@moonlight/material-theming/customizer';

@Component({
  // For standalone components
  imports: [ThemeSelectorComponent],
  // ...
})
export class YourComponent {}
```

### 2. Use in Your Template

```html
<ml-theme-selector></ml-theme-selector>
```

### 3. Provide Theme Configuration

Make sure you have set up your theme configuration using `@moonlight/material-theming/config` and provided it in your app's providers.

---

## Advanced Usage

### Customizing the Available Themes

You can provide your own set of theme presets to the selector:

```typescript
import { Component } from '@angular/core';
import { ThemeSelectorComponent } from '@moonlight/material-theming/customizer';
import { ThemeOption } from '@moonlight/material-theming/config';

@Component({
  selector: 'app-settings',
  template: `
    <h2>Theme Settings</h2>
    <ml-theme-selector [presetThemes]="organizationThemes"></ml-theme-selector>
  `,
  imports: [ThemeSelectorComponent],
  standalone: true
})
export class SettingsComponent {
  organizationThemes: ThemeOption[] = [
    ThemeOption.create({
      value: 'brand-primary',
      label: 'Brand Primary',
      primaryColor: '#003366',
      secondaryColor: '#ff9900'
    }),
    ThemeOption.create({
      value: 'brand-secondary',
      label: 'Brand Secondary',
      primaryColor: '#006633',
      secondaryColor: '#ffcc00'
    })
  ];
}
```

### Dialog Integration

The theme selector can be opened in a dialog for a cleaner user experience:

```typescript
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemeSelectorComponent } from '@moonlight/material-theming/customizer';

@Component({
  selector: 'app-nav',
  template: `
    <button mat-button (click)="openThemeDialog()">
      <mat-icon>palette</mat-icon>
      Customize Theme
    </button>
  `
})
export class NavComponent {
  private dialog = inject(MatDialog);
  
  openThemeDialog(): void {
    this.dialog.open(ThemeSelectorComponent, {
      width: '600px',
      maxHeight: '90vh'
    });
  }
}
```

---

## API Reference

### `<ml-theme-selector>`

#### Inputs

- `[presetThemes]` (optional): `ThemeOption[]`  
  Provide a custom list of preset themes to display.
  
- `[showCustomThemes]` (optional): `boolean`  
  Whether to show user-created custom themes. Default: `true`
  
- `[showExportOption]` (optional): `boolean`  
  Whether to show the export theme option. Default: `true`
  
- `[dialogMode]` (optional): `boolean`  
  Whether the component is being used in a dialog. Default: `false`

#### Outputs

- `(themeSelected)`: `EventEmitter<ThemeOption>`  
  Emits when a theme is selected (preset or custom).
  
- `(themeCreated)`: `EventEmitter<ThemeOption>`  
  Emits when a new custom theme is created.

---

## Working with Custom Themes

Users can create and save their own themes, which are automatically persisted between sessions using the browser's local storage. These custom themes can be:

- Created from scratch
- Based on existing preset themes
- Named and organized
- Removed when no longer needed
- Exported for sharing

The component automatically handles all the logic for saving, loading, and applying custom themes.

---

## Hierarchical Theming Integration

The theme selector works seamlessly with the hierarchical theming system. When used in different sections of your application, it will automatically display the themes available for that particular section:

```typescript
import { Component, OnDestroy } from '@angular/core';
import { DynamicThemeConfigService, ThemeOption } from '@moonlight/material-theming/config';

@Component({
  selector: 'app-seasonal-section',
  template: `
    <h1>Seasonal Themes</h1>
    <ml-theme-selector></ml-theme-selector>
    <router-outlet></router-outlet>
  `
})
export class SeasonalSectionComponent implements OnDestroy {
  constructor(private configService: DynamicThemeConfigService) {
    // Replace available themes with seasonal options
    this.configService.setSystemThemes([
      // Spring, Summer, Autumn, Winter themes
    ]);
  }
  
  ngOnDestroy() {
    // Restore original themes when leaving section
    this.configService.resetSystemThemesToInitial();
  }
}
```

---

## Best Practices

- Place the theme selector in a settings or customization area of your app
- Consider using it in a dialog for a cleaner main interface
- Use with dark mode toggle for a complete theming solution
- Encourage users to save and name their custom themes for easy reuse
- For applications with hierarchical theming, place theme selectors in each section

---

## Related Entry Points

- `@moonlight/material-theming/config` – Theme configuration utilities
- `@moonlight/material-theming/components` – Theme/dark mode toggle UI components
- `@moonlight/material-theming/service` – Core theme generation and application services
- `@moonlight/material-theming/showcase` – Theme showcase and preview components

---

## License

MIT
