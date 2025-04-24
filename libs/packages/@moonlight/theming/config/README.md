# @moonlight/material-theming/config

The configuration module for the Moonlight Material theming system. This module provides the foundation for defining and managing theme options across your application.

## Key Features

- **Theme Definitions** - Define themes with primary, secondary, and accent colors
- **Dark Mode Configuration** - Control light/dark mode behavior and system preference detection
- **Hierarchical Theming** - Configure different themes for different sections of your application
- **Runtime Theme Updates** - Add, remove, or modify themes dynamically during application execution
- **Theme Persistence** - Save and restore user theme preferences

## Main Classes

### ThemeOption

Defines a complete theme configuration including colors and dark mode settings:

```typescript
// Create a theme option
const myTheme = ThemeOption.create({
  value: 'ocean-blue',       // Unique theme identifier
  label: 'Ocean Blue',       // User-friendly name
  primaryColor: '#0277BD',   // Main color
  secondaryColor: '#26A69A', // Accent color
  tertiaryColor: '#7E57C2',  // Optional tertiary color
  errorColor: '#F44336',     // Optional error color
  darkMode: 'system'         // 'light', 'dark', or 'system'
});
```

### ThemingConfig

Central configuration for the theming system:

```typescript
// Create a theme configuration
const config = ThemingConfig.create({
  // Available themes in your application
  themeOptions: [
    ThemeOption.create({ /* ... */ }),
    ThemeOption.create({ /* ... */ }),
  ],
  
  // Default dark mode behavior (light, dark, system)
  defaultDarkModeType: 'system',
  
  // Theme transition settings
  transitionOptions: {
    style: 'morph',          // 'morph' or 'overlay'
    duration: 500,           // Transition duration in ms
    showTransitions: true    // Whether to show transitions
  },
  
  // CSS class prefix for theme classes
  themeClassPrefix: 'my-theme'
});
```

### DynamicThemeConfigService

Service for managing theme options at runtime:

```typescript
// Inject in your component or service
private themeConfig = inject(DynamicThemeConfigService);

// Add a new theme
themeConfig.addSystemTheme(ThemeOption.create({ /* ... */ }));

// Remove a theme
themeConfig.removeSystemTheme('theme-id');

// Set all available themes
themeConfig.setSystemThemes([/* array of ThemeOption */]);

// Reset to initial configuration
themeConfig.resetSystemThemesToInitial();
```

### ThemeAndModeSetup

Helper for setting up theme providers in your app:

```typescript
// In your app.config.ts
import { ApplicationConfig } from '@angular/core';
import { ThemeAndModeSetup } from '@moonlight/material-theming/config';
import { MY_THEME_CONFIG } from './theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    // Set up all theming providers with your configuration
    ThemeAndModeSetup.provideThemingModule(MY_THEME_CONFIG)
  ]
};
```

## Constants

The module provides several constants for theme configuration:

- `COLOR_VAR_PREFIX` - CSS variable prefix for color shades
- `DARK_MODE_CLASS` - CSS class applied to elements in dark mode
- `THEME_CLASS_PREFIX` - Default prefix for theme CSS classes

## Hierarchical Theming

One of the most powerful features is the ability to temporarily override themes for different sections of your application:

```typescript
@Component({
  selector: 'app-marketing-section',
  template: `
    <div class="marketing-container">
      <h1>Marketing Section</h1>
      <ml-theme-picker-mat></ml-theme-picker-mat>
      <router-outlet></router-outlet>
    </div>
  `
})
export class MarketingSectionComponent implements OnInit, OnDestroy {
  private themeConfig = inject(DynamicThemeConfigService);
  
  ngOnInit() {
    // Override themes just for this section
    this.themeConfig.setSystemThemes([
      ThemeOption.create({
        value: 'marketing-theme',
        label: 'Marketing Theme',
        primaryColor: '#E91E63',
        secondaryColor: '#FFC107'
      }),
      // More themes specific to this section...
    ]);
  }
  
  ngOnDestroy() {
    // Restore global themes when leaving this section
    this.themeConfig.resetSystemThemesToInitial();
  }
}
```

This enables different parts of your application to have their own theme contexts, with the `ThemeService` and theme components automatically adapting to show the context-specific themes.