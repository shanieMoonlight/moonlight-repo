# SpiderBaby Material Theming

A powerful, flexible theming system for Angular Material applications that enables dynamic theme switching without page reloads.

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
- **🔄 Dynamic theme configuration** - Update available themes at runtime
- **🎬 Smooth theme transitions** - Visually pleasing theme changes with overlay or morph effects
- **🗺️ Hierarchical theming** - Different sections of your app can have different themes

## Demo

[View the Live Demo](https://spiderbabymaterialtheming.web.app/)


## Prerequisites
### Important Note: This library requires Angular Material and CDK.

### Angular Material Setup Options:

### Option 1 (Recommended): Using the Angular CLI schematic
This command will install matching dependencies and set up themes, fonts, and animations automatically:

```bash
ng add @angular/material
```

### Option 2: Manual installation with version matching
Install Material and CDK that match your current Angular version:

```bash
npm install @angular/material @angular/cdk
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
import { ThemingConfig, ThemeOption } from '@spider-baby/material-theming/config';

export const THEME_CONFIG = ThemingConfig.create({
  themeOptions: [
    ThemeOption.create({
      value: 'indigo',
      label: 'Indigo',
      primaryColor: '#3F51B5',
      secondaryColor: '#FF4081',
      defaultDarkMode: 'system'
    }),
    ThemeOption.create({
      value: 'deeppurple',
      label: 'Deep Purple',
      primaryColor: '#673AB7',
      secondaryColor: '#00BCD4',
      defaultDarkMode: 'system'
    }),
    // Add more themes as needed
  ],
  defaultDarkModeType: 'system',
  transitionOptions: {
    style: 'morph',
    duration: 600,
    showTransitions: true
  }
});
```


### 2b. Configure your themes (Dynamic)

```typescript
// theme.config.ts
import { ThemingConfig, ThemeOption } from '@spider-baby/material-theming/config';

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
     defaultDarkMode: 'light',
    label: 'Xmas',
    value: 'xmas',
    primaryColor: '#C8102E',
    secondaryColor: '#006747',
  });

  export const HALLOWEEN_THEME: ThemeOption = ThemeOption.create({
     defaultDarkMode: 'dark',
    label: 'Halloween',
    value: 'halloween-theme',
    primaryColor: '#FF7518',
    secondaryColor: '#31004a',
  });

  if (IS_XMAS) _themeOptions.push(XMAS_THEME);
  if (IS_HALLOWEEN) _themeOptions.push(HALLOWEEN_THEME);

  export const THEME_CONFIG = ThemingConfig.create({
    themeOptions: _themeOptions,
    defaultDarkModeType: 'system',
    transitionOptions: {
      style: 'morph',
      duration: 400,
      showTransitions: true
    }
  });
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
    <sb-dark-mode-toggle-mat></sb-dark-mode-toggle-mat>
    <sb-theme-picker-mat></sb-theme-picker-mat>
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
<sb-dark-mode-toggle-mat></sb-dark-mode-toggle-mat>

<!-- With switch -->
<sb-dark-mode-toggle-mat [hideSwitch]="false"></sb-dark-mode-toggle-mat>
```

### Theme Picker

```html
<sb-theme-picker-mat></sb-theme-picker-mat>
```

### Theme Customizer

```html
<sb-theme-selector></sb-theme-selector>
```

### Theme Showcase

```html
<sb-theme-showcase-mat></sb-theme-showcase-mat>
```

### Theme Transition Indicator

```html
<!-- Add this component to show a visual indicator during theme transitions -->
<sb-theme-transition-indicator></sb-theme-transition-indicator>
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
  background-color: var(--mat-sys-primary-40);
  border-color: var(--mat-sys-primary-80);
  
  /* Different palette types */
  color: var(--mat-sys-secondary-50);
  box-shadow: 0 2px 4px var(--mat-sys-neutral-0);
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
    const current = this.themeService.darkModeType();
    this.themeService.setDarkMode(
      current === 'dark' ? 'light' : 'dark'
    );
  }
  
  // Set a specific theme
  setTheme(themeValue: string) {
    this.themeService.setThemeByValue(themeValue);
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
    this.generator.applyTheme(theme, this.container.nativeElement);
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
import { DynamicThemeConfigService, ThemeOption } from '@spider-baby/material-theming/config';

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
         defaultDarkMode: 'light'
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

## Hierarchical Theming

One of the most powerful features of this library is hierarchical theming, which allows different parts of your application to have their own theme contexts.

### Creating Section-Specific Themes

Different sections of your application can have their own set of theme options:

```typescript
import { Component, OnDestroy, inject } from '@angular/core';
import { DynamicThemeConfigService, ThemeOption } from '@spider-baby/material-theming/config';

@Component({
  selector: 'app-marketing-section',
  templateUrl: './marketing-section.component.html'
})
export class MarketingSectionComponent implements OnDestroy {
  private dynamicThemeConfig = inject(DynamicThemeConfigService);
  
  constructor() {
    // Override available themes just for this section
    this.dynamicThemeConfig.setSystemThemes([
      ThemeOption.create({
        value: 'brand-primary',
        label: 'Brand Primary',
        primaryColor: '#2E5CE6',
        secondaryColor: '#F6BC00',
        defaultDarkMode: 'light'
      }),
      ThemeOption.create({
        value: 'brand-secondary',
        label: 'Brand Secondary',
        primaryColor: '#6C3DF4',
        secondaryColor: '#00D0BF',
        defaultDarkMode: 'light'
      })
    ]);
  }
  
  ngOnDestroy() {
    // Reset to application-wide themes when leaving this section
    this.dynamicThemeConfig.resetSystemThemesToInitial();
  }
}
```

Theme selectors in your application will automatically update to show only the themes available in the current context.

### Use Cases for Hierarchical Theming

- **Marketing Campaigns**: Different campaigns can have unique themes
- **Seasonal Content**: Holiday-specific sections with themed UI
- **White-Labeling**: Customize themes for different clients in a multi-tenant application
- **Feature Sandboxes**: Special themes for experimental features
- **Admin vs User Areas**: Different themes for different user roles

## Theme Transitions

Smooth transitions between themes enhance the user experience. Configure transition settings in your theme configuration:

```typescript
import { ThemingConfig } from '@spider-baby/material-theming/config';

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
import { ThemeOption } from '@spider-baby/material-theming/config';
import { ThemeTransitionService } from '@spider-baby/material-theming/service';

@Component({/*...*/})
export class ThemeManager {
  private transitionService = inject(ThemeTransitionService);
  
  switchTheme(from: ThemeOption, to: ThemeOption) {
    // Manually trigger a transition between themes
    this.transitionService.transitionThemes(from, to);
  }
  
  // Check if a transition is in progress
  get isTransitioning() {
    return this.transitionService.isTransitioning();
  }
}
```

### Transition Styles

The library supports two transition styles:

#### Overlay Transition
A full-screen overlay appears briefly while the theme changes, creating a clean break between themes. This is ideal for dramatic theme changes with high contrast differences.

#### Morph Transition
All colors smoothly animate from their old values to new values, creating a fluid morphing effect. This works best for related color schemes or subtle theme changes.

### Theme Transition Indicator

For the best user experience, add the transition indicator component to show when a theme change is in progress:

```html
<sb-theme-transition-indicator></sb-theme-transition-indicator>
```

This component automatically shows a subtle loading indicator during theme transitions and hides itself when the transition is complete.

## Performance Benefits

This library offers several performance advantages over traditional Angular Material theming:

1. **Smaller bundle sizes** - Color palettes are generated at runtime instead of shipping pre-compiled CSS
2. **Tree-shakable architecture** - Import only what you need
3. **Memoized color generation** - Palette calculations are cached for improved performance
4. **Batched DOM updates** - Changes use requestAnimationFrame for efficient rendering
5. **Minimal DOM operations** - CSS variables are updated efficiently in batches

## Entry Points

The library is organized into multiple entry points:

- `@spider-baby/material-theming/service` - Core theming services
- `@spider-baby/material-theming/components` - Ready-to-use UI components
- `@spider-baby/material-theming/config` - Theme configuration utilities
- `@spider-baby/material-theming/customizer` - Theme selection & customization UI
- `@spider-baby/material-theming/showcase` - Components for theme showcases
- `@spider-baby/material-theming/utils` - Utility functions and helpers

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
   defaultDarkMode: 'light',
  label: 'Christmas',
  value: 'xmas',
  primaryColor: '#C8102E', // Red
  secondaryColor: '#006747', // Green
});

const HALLOWEEN_THEME = ThemeOption.create({
   defaultDarkMode: 'dark',
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

export const THEME_CONFIG = ThemingConfig.create({
  themeOptions: themeOptions,
  // Other configuration options...
});
```

## Browser Support

Works in all modern browsers that support:
- CSS Custom Properties (Variables)
- ES2020+ features


# SpiderBaby Theming CSS Variables Reference

The SpiderBaby theming system provides a comprehensive set of CSS variables that follow the Material Design 3 specification.
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
- `--mat-sys-primary-0`
- `--mat-sys-primary-1`
- `--mat-sys-primary-2`
- `--mat-sys-primary-4`
- `--mat-sys-primary-6`
- `--mat-sys-primary-10`
- `--mat-sys-primary-12`
- `--mat-sys-primary-17`
- `--mat-sys-primary-20`
- `--mat-sys-primary-22`
- `--mat-sys-primary-24`
- `--mat-sys-primary-30`
- `--mat-sys-primary-40`
- `--mat-sys-primary-50`
- `--mat-sys-primary-60`
- `--mat-sys-primary-70`
- `--mat-sys-primary-80`
- `--mat-sys-primary-87`
- `--mat-sys-primary-90`
- `--mat-sys-primary-92`
- `--mat-sys-primary-94`
- `--mat-sys-primary-95`
- `--mat-sys-primary-96`
- `--mat-sys-primary-98`
- `--mat-sys-primary-99`
- `--mat-sys-primary-100`

### Secondary, Tertiary, Error, Neutral, and Neutral Variant Palettes
Each of these palettes also has the full range of tone variables from 0-100, following the same pattern as the primary palette.

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
  box-shadow: 0 2px 4px var(--mat-sys-primary-40);
}
```

## Extras

### Why Version Matching Matters

<!-- Due to npm's peer dependency resolution algorithm, you must install Angular Material and CDK versions that match your application's Angular version before installing this package. This is because: -->

1. Angular Material and CDK require exact Angular version alignment
2. When npm encounters a range of compatible versions like `"17.x || 18.x || 19.x"`, it tends to select the newest version  (like the settings in this package)
3. This can lead to conflicts when the newest Material/CDK version requires a newer Angular version than what's in your project

### Step 1: Install matching Angular Material/CDK versions

First, install Angular Material and CDK versions that match your Angular version:

```bash
# To let npm figure it out 
npm install @angular/material @angular/cdk

# For Angular 17
npm install @angular/material@17 @angular/cdk@17

# For Angular 18
npm install @angular/material@18 @angular/cdk@18

# For Angular 19
npm install @angular/material@19 @angular/cdk@19
```

### Step 2: Install @spider-baby/material-theming

```bash
npm install @spider-baby/material-theming
```

### Alternative: Using package.json overrides

If you prefer, you can add these overrides to your package.json before installing:

```json
"overrides": {
  "@angular/cdk": "18.2.13",
  "@angular/material": "18.2.13"
}
```

Replace the version numbers with those matching your Angular version.

### Troubleshooting

If you encounter dependency conflicts, you can force installation with:

```bash
npm install @spider-baby/material-theming --legacy-peer-deps
```

However, this approach may lead to subtle compatibility issues and is not recommended for production.
#### The simplest thing is to just make sure Material/CDK are installed first.

## License

MIT
