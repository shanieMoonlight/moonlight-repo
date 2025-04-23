# Moonlight Material Theming

A powerful, flexible theming system for Angular Material applications that enables dynamic theme switching without page reloads.

[![npm version](https://img.shields.io/npm/v/@moonlight/material/theming.svg)](https://www.npmjs.com/package/@moonlight/material/theming)
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
- **🔄 Dynamic theme configuration** - Update available themes at runtime
- **🎬 Smooth theme transitions** - Visually pleasing theme changes with overlay or morph effects

## Installation

```bash
npm install @moonlight/material/theming
```

## Quick Start

### 1. Set up your Angular Material configuration

```scss
// styles.scss
@use '@angular/material' as mat;

// Import color overrides to enable theming support
@use '@moonlight/material/theming/styles/mat-color-overrides';

// Configure Angular Material with an empty theme (variables set by ThemeGeneratorService)
html {
  @include mat.theme((
    typography: Roboto
  ));
}

// Include core styles
@include mat.core();
```

### 2. Configure your themes

```typescript
// theme.config.ts
import { ThemeConfig, ThemeOption } from '@moonlight/material/theming/config';

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


### 2b. Configure your themes (Dynamic)

```typescript
// theme.config.ts
import { ThemeConfig, ThemeOption } from '@moonlight/material/theming/config';

  const today = new Date();
  const thisYear = today.getFullYear();
  const xmasTime = new Date(thisYear, 11, 1);
  const halloweenTimeStart = new Date(thisYear, 10, 1);
  const halloweenTimeEnd = new Date(thisYear, 11, 1);
  export const IS_XMAS = today >= xmasTime;
  export const IS_HALLOWEEN = today >= halloweenTimeStart && today < halloweenTimeEnd;


  const _themeOptions: ThemeOption[] = [
    ThemeOption.create({
      value: 'ocean-blue', 
      label: 'Ocean Blue', 
      primaryColor: '#0277BD', 
      secondaryColor: '#26A69A' 
    }),
    ThemeOption.create({
      value: 'sunset-orange', 
      label: 'Sunset Orange', 
      primaryColor: '#FF5722', 
      secondaryColor: '#FFC107' 
    })
  ];

  export const XMAS_THEME: ThemeOption = ThemeOption.create({
     darkMode: 'light',
    label: 'Xmas',
    value: 'xmas',
    primaryColor: '#C8102E',
    secondaryColor: '#006747',
  });

  export const HALLOWEEN_THEME: ThemeOption = ThemeOption.create({
     darkMode: 'dark',
    label: 'Halloween',
    value: 'halloween-theme',
    primaryColor: '#FF7518',
    secondaryColor: '#31004a',
  });

  if (IS_XMAS) _themeOptions.push(XMAS_THEME);
  if (IS_HALLOWEEN) _themeOptions.push(HALLOWEEN_THEME);

  export const THEME_CONFIG = ThemeConfig.create(_themeOptions);
```

### 3. Set up the theme providers

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ThemeAndModeSetup } from '@moonlight/material/theming/config';
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
import { ThemeService } from '@moonlight/material/theming/service';

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
import { ThemeGeneratorService } from '@moonlight/material/theming/service';
import { ThemeOption } from '@moonlight/material/theming/config';

@Component({/*...*/})
export class ThemePreviewComponent {
  @ViewChild('previewContainer') container!: ElementRef;
  
  private generator = inject(ThemeGeneratorService);
  
  previewTheme(theme: ThemeOption) {
    this.generator.applyTheme(theme, undefined, this.container.nativeElement);
  }
}
```

## Dynamic Theme Configuration

The `DynamicThemeConfigService` allows updating themes at runtime, which is useful for:

- Adding seasonal themes based on special events or dates
- Loading themes from a backend API
- Creating an admin panel to modify available themes

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { DynamicThemeConfigService, ThemeOption } from '@moonlight/material/theming/config';

@Component({/*...*/})
export class SeasonalComponent implements OnInit {
  private themeConfig = inject(DynamicThemeConfigService);
  
  ngOnInit() {
    // Check if it's a holiday and add a special theme
    const today = new Date();
    if (today.getMonth() === 6 && today.getDate() === 4) { // July 4th
      const independenceTheme = ThemeOption.create({
        value: 'july4th',
        label: 'Independence Day',
        primaryColor: '#3C3B6E', // Navy blue
        secondaryColor: '#B22234', // Red
         darkMode: 'light'
      });
      
      this.themeConfig.addSystemTheme(independenceTheme);
    }
  }
  
  // Reset all themes to initial configuration
  resetThemes() {
    this.themeConfig.resetSystemThemesToInitial();
  }
  
  // Replace all themes with new ones
  loadThemesFromApi(themes: ThemeOption[]) {
    this.themeConfig.setSystemThemes(themes);
  }
}
```

The `ThemeService` automatically watches for changes in available themes and handles cases where the current theme is removed, falling back to the first available theme.

## Theme Transitions

Smooth transitions between themes enhance the user experience. Configure transition settings in your theme configuration:

```typescript
import { ThemingConfig } from '@moonlight/material/theming/config';

export const THEME_CONFIG = ThemingConfig.create({
  // Your theme options...
  transitionOptions: {
    // 'overlay' shows a fade transition between themes
    // 'morph' smoothly transitions all colors simultaneously
    style: 'morph', 
    
    // Duration of transition in milliseconds
    duration: 800,
    
    // Enable/disable transitions
    showTransitions: true
  }
});
```

You can also use the `ThemeTransitionService` directly for advanced use cases:

```typescript
import { Component, inject } from '@angular/core';
import { ThemeOption } from '@moonlight/material/theming/config';
import { ThemeTransitionService } from '@moonlight/material/theming/service';

@Component({/*...*/})
export class ThemeManager {
  private transitionService = inject(ThemeTransitionService);
  
  switchTheme(from: ThemeOption, to: ThemeOption) {
    // Manually trigger a transition between themes
    this.transitionService.transitionThemes(from, to);
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

- `@moonlight/material/theming/service` - Core theming services
- `@moonlight/material/theming/components` - Ready-to-use UI components
- `@moonlight/material/theming/config` - Theme configuration utilities
- `@moonlight/material/theming/customizer` - Theme selection & customization UI
- `@moonlight/material/theming/ui` - UI elements for theme visualization
- `@moonlight/material/theming/utils` - Utility functions and helpers
- `@moonlight/material/theming/showcase` - Components for theme showcases

Import from specific entry points instead of the main entry point to take advantage of tree-shaking:

```typescript
// Good - specific imports
import { ThemeService } from '@moonlight/material/theming/service';
import { ThemeOption } from '@moonlight/material/theming/config';

// Bad - don't import from the main entry point
import { UseSecondaryEntryPoints } from '@moonlight/material/theming';
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


# Moonlight Theming CSS Variables Reference

The Moonlight theming system provides a comprehensive set of CSS variables that follow the Material Design 3 specification.
This reference documents all available variables that you can use in your application's styles.

## Material Design 3 Theme System Variables

### Primary Colors
- `--mat-sys-primary` - Primary color
- `--mat-sys-on-primary` - Text/icons on primary color
- `--mat-sys-primary-container` - Container with primary color
- `--mat-sys-on-primary-container` - Text/icons on primary container
- `--mat-sys-primary-fixed` - Fixed variant of primary
- `--mat-sys-primary-fixed-dim` - Dimmed fixed variant of primary
- `--mat-sys-on-primary-fixed` - Text/icons on fixed primary
- `--mat-sys-on-primary-fixed-variant` - Variant text/icons on fixed primary
- `--mat-sys-inverse-primary` - Inverse of primary color

### Secondary Colors
- `--mat-sys-secondary` - Secondary color
- `--mat-sys-on-secondary` - Text/icons on secondary color
- `--mat-sys-secondary-container` - Container with secondary color
- `--mat-sys-on-secondary-container` - Text/icons on secondary container
- `--mat-sys-secondary-fixed` - Fixed variant of secondary
- `--mat-sys-secondary-fixed-dim` - Dimmed fixed variant of secondary
- `--mat-sys-on-secondary-fixed` - Text/icons on fixed secondary
- `--mat-sys-on-secondary-fixed-variant` - Variant text/icons on fixed secondary

### Tertiary Colors
- `--mat-sys-tertiary` - Tertiary color
- `--mat-sys-on-tertiary` - Text/icons on tertiary color
- `--mat-sys-tertiary-container` - Container with tertiary color
- `--mat-sys-on-tertiary-container` - Text/icons on tertiary container
- `--mat-sys-tertiary-fixed` - Fixed variant of tertiary
- `--mat-sys-tertiary-fixed-dim` - Dimmed fixed variant of tertiary

### Error Colors
- `--mat-sys-error` - Error color
- `--mat-sys-on-error` - Text/icons on error color
- `--mat-sys-error-container` - Container with error color
- `--mat-sys-on-error-container` - Text/icons on error container

### Surface and Background
- `--mat-sys-background` - Background color
- `--mat-sys-on-background` - Text/icons on background
- `--mat-sys-surface` - Surface color
- `--mat-sys-on-surface` - Text/icons on surface
- `--mat-sys-surface-variant` - Variant surface color
- `--mat-sys-on-surface-variant` - Text/icons on surface variant
- `--mat-sys-inverse-surface` - Inverse surface color
- `--mat-sys-inverse-on-surface` - Text/icons on inverse surface

### Surface Variants
- `--mat-sys-surface-container` - Container surface color
- `--mat-sys-surface-container-low` - Low emphasis container surface
- `--mat-sys-surface-container-high` - High emphasis container surface
- `--mat-sys-surface-container-lowest` - Lowest emphasis container surface
- `--mat-sys-surface-container-highest` - Highest emphasis container surface
- `--mat-sys-surface-dim` - Dimmed surface color
- `--mat-sys-surface-bright` - Bright surface color

### Outline and Miscellaneous
- `--mat-sys-outline` - Outline color
- `--mat-sys-outline-variant` - Variant outline color
- `--mat-sys-surface-tint` - Surface tint color
- `--mat-sys-scrim` - Scrim color for overlays
- `--mat-sys-shadow` - Shadow color
- `--mat-sys-neutral10` - Neutral color at 10% tone
- `--mat-sys-neutral-variant20` - Neutral variant color at 20% tone

## RGB Values for Transparency Support
- `--mat-sys-primary-rgb` - RGB values of primary color
- `--mat-sys-on-primary-rgb` - RGB values of on-primary color
- `--mat-sys-primary-container-rgb` - RGB values of primary container
- `--mat-sys-secondary-rgb` - RGB values of secondary color
- `--mat-sys-on-secondary-rgb` - RGB values of on-secondary color
- `--mat-sys-surface-rgb` - RGB values of surface color
- `--mat-sys-on-surface-rgb` - RGB values of on-surface color
- `--mat-sys-error-rgb` - RGB values of error color
- `--mat-sys-background-rgb` - RGB values of background color

## Original Seed Colors
- `--mat-seed-primary` - Original primary color hex
- `--mat-seed-secondary` - Original secondary color hex
- `--mat-seed-tertiary` - Original tertiary color hex
- `--mat-seed-error` - Original error color hex

## Complete Palette Tone Variables

### Primary Palette Tones
- `--ml-color-primary-0`
- `--ml-color-primary-1`
- `--ml-color-primary-2`
- `--ml-color-primary-4`
- `--ml-color-primary-6`
- `--ml-color-primary-10`
- `--ml-color-primary-12`
- `--ml-color-primary-17`
- `--ml-color-primary-20`
- `--ml-color-primary-22`
- `--ml-color-primary-24`
- `--ml-color-primary-30`
- `--ml-color-primary-40`
- `--ml-color-primary-50`
- `--ml-color-primary-60`
- `--ml-color-primary-70`
- `--ml-color-primary-80`
- `--ml-color-primary-87`
- `--ml-color-primary-90`
- `--ml-color-primary-92`
- `--ml-color-primary-94`
- `--ml-color-primary-95`
- `--ml-color-primary-96`
- `--ml-color-primary-98`
- `--ml-color-primary-99`
- `--ml-color-primary-100`

### Secondary Palette Tones
- `--ml-color-secondary-0`
- `--ml-color-secondary-1`
- `--ml-color-secondary-2`
- `--ml-color-secondary-4`
- `--ml-color-secondary-6`
- `--ml-color-secondary-10`
- `--ml-color-secondary-12`
- `--ml-color-secondary-17`
- `--ml-color-secondary-20`
- `--ml-color-secondary-22`
- `--ml-color-secondary-24`
- `--ml-color-secondary-30`
- `--ml-color-secondary-40`
- `--ml-color-secondary-50`
- `--ml-color-secondary-60`
- `--ml-color-secondary-70`
- `--ml-color-secondary-80`
- `--ml-color-secondary-87`
- `--ml-color-secondary-90`
- `--ml-color-secondary-92`
- `--ml-color-secondary-94`
- `--ml-color-secondary-95`
- `--ml-color-secondary-96`
- `--ml-color-secondary-98`
- `--ml-color-secondary-99`
- `--ml-color-secondary-100`

### Tertiary Palette Tones
- `--ml-color-tertiary-0`
- `--ml-color-tertiary-1`
- `--ml-color-tertiary-2`
- `--ml-color-tertiary-4`
- `--ml-color-tertiary-6`
- `--ml-color-tertiary-10`
- `--ml-color-tertiary-12`
- `--ml-color-tertiary-17`
- `--ml-color-tertiary-20`
- `--ml-color-tertiary-22`
- `--ml-color-tertiary-24`
- `--ml-color-tertiary-30`
- `--ml-color-tertiary-40`
- `--ml-color-tertiary-50`
- `--ml-color-tertiary-60`
- `--ml-color-tertiary-70`
- `--ml-color-tertiary-80`
- `--ml-color-tertiary-87`
- `--ml-color-tertiary-90`
- `--ml-color-tertiary-92`
- `--ml-color-tertiary-94`
- `--ml-color-tertiary-95`
- `--ml-color-tertiary-96`
- `--ml-color-tertiary-98`
- `--ml-color-tertiary-99`
- `--ml-color-tertiary-100`

### Error Palette Tones
- `--ml-color-error-0`
- `--ml-color-error-1`
- `--ml-color-error-2`
- `--ml-color-error-4`
- `--ml-color-error-6`
- `--ml-color-error-10`
- `--ml-color-error-12`
- `--ml-color-error-17`
- `--ml-color-error-20`
- `--ml-color-error-22`
- `--ml-color-error-24`
- `--ml-color-error-30`
- `--ml-color-error-40`
- `--ml-color-error-50`
- `--ml-color-error-60`
- `--ml-color-error-70`
- `--ml-color-error-80`
- `--ml-color-error-87`
- `--ml-color-error-90`
- `--ml-color-error-92`
- `--ml-color-error-94`
- `--ml-color-error-95`
- `--ml-color-error-96`
- `--ml-color-error-98`
- `--ml-color-error-99`
- `--ml-color-error-100`

### Neutral Palette Tones
- `--ml-color-neutral-0`
- `--ml-color-neutral-1`
- `--ml-color-neutral-2`
- `--ml-color-neutral-4`
- `--ml-color-neutral-6`
- `--ml-color-neutral-10`
- `--ml-color-neutral-12`
- `--ml-color-neutral-17`
- `--ml-color-neutral-20`
- `--ml-color-neutral-22`
- `--ml-color-neutral-24`
- `--ml-color-neutral-30`
- `--ml-color-neutral-40`
- `--ml-color-neutral-50`
- `--ml-color-neutral-60`
- `--ml-color-neutral-70`
- `--ml-color-neutral-80`
- `--ml-color-neutral-87`
- `--ml-color-neutral-90`
- `--ml-color-neutral-92`
- `--ml-color-neutral-94`
- `--ml-color-neutral-95`
- `--ml-color-neutral-96`
- `--ml-color-neutral-98`
- `--ml-color-neutral-99`
- `--ml-color-neutral-100`

### Neutral Variant Palette Tones
- `--ml-color-neutralVariant-0`
- `--ml-color-neutralVariant-1`
- `--ml-color-neutralVariant-2`
- `--ml-color-neutralVariant-4`
- `--ml-color-neutralVariant-6`
- `--ml-color-neutralVariant-10`
- `--ml-color-neutralVariant-12`
- `--ml-color-neutralVariant-17`
- `--ml-color-neutralVariant-20`
- `--ml-color-neutralVariant-22`
- `--ml-color-neutralVariant-24`
- `--ml-color-neutralVariant-30`
- `--ml-color-neutralVariant-40`
- `--ml-color-neutralVariant-50`
- `--ml-color-neutralVariant-60`
- `--ml-color-neutralVariant-70`
- `--ml-color-neutralVariant-80`
- `--ml-color-neutralVariant-87`
- `--ml-color-neutralVariant-90`
- `--ml-color-neutralVariant-92`
- `--ml-color-neutralVariant-94`
- `--ml-color-neutralVariant-95`
- `--ml-color-neutralVariant-96`
- `--ml-color-neutralVariant-98`
- `--ml-color-neutralVariant-99`
- `--ml-color-neutralVariant-100`

## Usage Example

```scss
.my-custom-element {
  // Use primary color with 70% opacity
  background-color: rgba(var(--mat-sys-primary-rgb), 0.7);
  
  // Use on-surface color for text
  color: var(--mat-sys-on-surface);
  
  // Use error container for highlights
  border: 2px solid var(--mat-sys-error-container);
  
  // Use specific tone from primary palette
  box-shadow: 0 2px 4px var(--ml-color-primary-40);
}



## License

MIT
