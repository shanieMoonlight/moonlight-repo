# SpiderBaby Material Theming

A powerful, flexible theming system for Angular Material applications that enables dynamic theme switching without page reloads. Built upon [Angular Material](https://material.angular.io/), this library extends its capabilities with runtime theme changes, hierarchical sections, and CSS variable-based theming.

[![npm version](https://img.shields.io/npm/v/@spider-baby/material-theming.svg)](https://www.npmjs.com/package/@spider-baby/material-theming)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **🎨 Dynamic theming** - Change themes at runtime without compilation steps
- **🌙 Dark mode support** - Effortless dark/light mode switching with system preference detection
- **📱 Customizable themes** - Create and save custom themes with persistence
- **✨ Material Design 3** - Full implementation of M3 color system
- **📊 Performance optimized** - Memoized color calculations and efficient DOM updates
- **🏗️ Modular architecture** - Tree-shakable with multiple entry points
- **💾 Persistent preferences** - User theme choices and settings are saved between sessions
- **🔄 CSS Variables** - Modern implementation using CSS custom properties

## Installation

```bash
npm install @spider-baby/material-theming
```

## Quick Start

### 1. Set up your Angular Material configuration

```scss
// styles.scss
@use '@angular/material' as mat;

// Import color overrides to enable theming support
@use '@spider-baby/material-theming/styles/mat-color-overrides';

// Configure Angular Material with an empty theme (variables set by ThemeGeneratorService)
html {
  @include mat.theme(());
}

// Include core styles 
@include mat.core();
```

### 2. Configure your themes

```typescript
// theme.config.ts
import { ThemeConfig, ThemeOption } from '@spider-baby/material-theming/config';

export const THEME_CONFIG = ThemeConfig.create([
  ThemeOption.create({
    value: 'indigo',
    label: 'Indigo',
    primaryColor: '#3F51B5',
    secondaryColor: '#FF4081',
    darkMode: 'system'
  }),
  ThemeOption.create({
    value: 'deeppurple',
    label: 'Deep Purple',
    primaryColor: '#673AB7',
    secondaryColor: '#00BCD4',
    darkMode: 'system'
  }),
  // Add more themes as needed
]);
```

### 3. Set up the theme providers

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ThemeAndModeSetup } from '@spider-baby/material-theming/config';
import { THEME_CONFIG } from './theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    ThemeAndModeSetup.provideThemingModule(THEME_CONFIG)
  ]
};
```

### 4. Add the theme controls to your app

```html
<!-- app.component.html -->
<div class="app-container">
  <header>
    <ml-dark-mode-toggle-mat></ml-dark-mode-toggle-mat>
    <ml-theme-picker-mat></ml-theme-picker-mat>
  </header>
  
  <main>
    <router-outlet></router-outlet>
  </main>
</div>
```

## Components

### Dark Mode Toggle

```html
<!-- Icon only -->
<ml-dark-mode-toggle-mat></ml-dark-mode-toggle-mat>

<!-- With switch -->
<ml-dark-mode-toggle-mat [hideSwitch]="false"></ml-dark-mode-toggle-mat>
```

### Theme Picker

```html
<ml-theme-picker-mat></ml-theme-picker-mat>
```

### Theme Customizer

```html
<ml-theme-selector></ml-theme-selector>
```

### Theme Showcase

```html
<ml-theme-showcase-mat></ml-theme-showcase-mat>
```

## Using CSS Variables

The library exposes theme colors through CSS variables following these patterns:

### Material Design System Colors

```css
.my-element {
  background-color: var(--mat-sys-primary);
  color: var(--mat-sys-on-primary);
  border-color: var(--mat-sys-outline);
}
```

### Original Seed Colors

```css
.my-element {
  background-color: var(--mat-seed-primary);
}
```

### Full Color Palette with Tones

```css
.my-element {
  /* Access any tone from 0-100 */
  background-color: var(--color-primary-40);
  border-color: var(--color-primary-80);
  
  /* Different palette types */
  color: var(--color-secondary-50);
  box-shadow: 0 2px 4px var(--color-neutral-0);
}
```

Available tones: 0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100

## Working with the API

### Using ThemeService

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from '@spider-baby/material-theming/service';

@Component({/*...*/})
export class MyComponent {
  private themeService = inject(ThemeService);
  
  // Access current theme
  currentTheme = this.themeService.currentTheme;
  
  // Toggle dark mode
  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
  
  // Set a specific theme
  setTheme(themeValue: string) {
    const themes = this.themeService.systemThemes();
    const theme = themes.find(t => t.value === themeValue);
    if (theme) {
      this.themeService.setTheme(theme);
    }
  }
}
```

### Apply Theme to Specific Element

```typescript
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ThemeGeneratorService } from '@spider-baby/material-theming/service';
import { ThemeOption } from '@spider-baby/material-theming/config';

@Component({/*...*/})
export class ThemePreviewComponent {
  @ViewChild('previewContainer') container!: ElementRef;
  
  private generator = inject(ThemeGeneratorService);
  
  previewTheme(theme: ThemeOption) {
    this.generator.applyTheme(theme, undefined, this.container.nativeElement);
  }
}
```

## Performance Benefits

This library offers several performance advantages over traditional Angular Material theming:

1. **Smaller bundle sizes** - Color palettes are generated at runtime instead of shipping pre-compiled CSS
2. **Tree-shakable architecture** - Import only what you need
3. **Memoized color generation** - Palette calculations are cached for improved performance
4. **Batched DOM updates** - Changes use requestAnimationFrame for efficient rendering

## Entry Points

The library is organized into multiple entry points:

- `@spider-baby/material-theming/service` - Core theming services
- `@spider-baby/material-theming/components` - Ready-to-use UI components
- `@spider-baby/material-theming/config` - Theme configuration utilities
- `@spider-baby/material-theming/customizer` - Theme selection & customization UI
- `@spider-baby/material-theming/ui` - UI elements for theme visualization
- `@spider-baby/material-theming/utils` - Utility functions and helpers
- `@spider-baby/material-theming/showcase` - Components for theme showcases

Import from specific entry points instead of the main entry point to take advantage of tree-shaking:

```typescript
// Good - specific imports
import { ThemeService } from '@spider-baby/material-theming/service';
import { ThemeOption } from '@spider-baby/material-theming/config';

// Bad - don't import from the main entry point
import { UseSecondaryEntryPoints } from '@spider-baby/material-theming';
```

## Persistence

User preferences are automatically saved between sessions:

- **Theme selection** - Users' chosen theme is remembered
- **Dark mode preference** - Light/dark mode setting persists
- **Custom themes** - User-created themes are stored
- **Configurable storage** - Uses localStorage by default with options for custom storage strategies

## Seasonal Themes

The library supports seasonal themes that can be automatically enabled based on the date:

```typescript
// Seasonal theme examples
const XMAS_THEME = ThemeOption.create({
   darkMode: 'light',
  label: 'Christmas',
  value: 'xmas',
  primaryColor: '#C8102E', // Red
  secondaryColor: '#006747', // Green
});

const HALLOWEEN_THEME = ThemeOption.create({
   darkMode: 'dark',
  label: 'Halloween',
  value: 'halloween',
  primaryColor: '#FF7518', // Orange
  secondaryColor: '#31004a', // Purple
});

// Check date to conditionally include seasonal themes
const today = new Date();
const isChristmasTime = today.getMonth() === 11; // December
const isHalloweenTime = today.getMonth() === 9; // October

const themeOptions = [
  // Base themes...
];

if (isChristmasTime) themeOptions.push(XMAS_THEME);
if (isHalloweenTime) themeOptions.push(HALLOWEEN_THEME);

export const THEME_CONFIG = ThemeConfig.create(themeOptions);
```

## Browser Support

Works in all modern browsers that support:
- CSS Custom Properties (Variables)
- ES2020+ features

## Acknowledgments

This library is built on top of [Angular Material](https://material.angular.io/), a comprehensive UI component library that implements Google's Material Design specifications. Angular Material provides the foundation for our theming system, and we extend its capabilities with runtime theme switching, hierarchical theming, and additional features.

- [Angular Material documentation](https://material.angular.io/guides)
- [Material Design specifications](https://m3.material.io/)

The Angular Material library is licensed under the MIT License and is maintained by the Angular team at Google.


## License

MIT
