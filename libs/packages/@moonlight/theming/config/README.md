# @moonlight/material/theming/config

Secondary entry point of `@moonlight/material/theming`. It can be used by importing from `@moonlight/material/theming/config`.

## Overview

The `/config` entry point provides configuration utilities for setting up and managing themes in Angular applications. It offers a simple, declarative way to define theme options, default themes, and integrate with Angular's dependency injection.

## Key Features

- Define multiple theme options with customizable colors and properties
- Configure dark mode behavior (forced or system-based)
- Easily set up theming providers for your Angular application
- Type-safe theme configuration

## Installation

This entry point is included with the main package:

```bash
npm install @moonlight/material/theming
```

## Usage

### 1. Define Your Theme Configuration

Create a file to define your application's theme options:

```typescript
// app-theme.config.ts
import { ThemeConfig, ThemeOption } from "@moonlight/material/theming/config";

// Define theme options
const themeOptions: ThemeOption[] = [
  ThemeOption.create({
    darkMode: 'system',
    label: 'Default',
    value: 'default',
    primaryColor: '#4682B4',  // Steel blue
    secondaryColor: '#D2691E', // Chocolate
  }),
  ThemeOption.create({
    darkMode: false,
    label: 'Violet and Lime',
    value: 'violet-lime',
    primaryColor: '#8A2BE2',  // Violet
    secondaryColor: '#32CD32', // Lime green
  }),
  // Add more themes as needed
];

// Create the theme configuration
export const THEME_CONFIG = ThemeConfig.create(themeOptions);
```

### 2. Set Up in Your Application

In your app configuration, use the `ThemeAndModeSetup` utility to set up the necessary providers:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { ThemeAndModeSetup } from '@moonlight/material/theming/config';
import { THEME_CONFIG } from './config/app-theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    // Other providers...
    ThemeAndModeSetup.getThemeProviders(THEME_CONFIG)
  ],
};
```

## API Reference

### ThemeOption

A class for creating theme options with properly typed properties.

#### Properties

- `value`: Unique identifier for the theme
- `label`: Display name for the theme
- `primaryColor`: Primary color in hex format
- `secondaryColor`: Secondary color in hex format
- `tertiaryColor` (optional): Tertiary color in hex format
- `errorColor` (optional): Error color in hex format
- `darkMode`: Controls dark mode behavior (boolean or 'system')

#### Methods

- `static create(options: ThemeOptionParams): ThemeOption` - Factory method to create theme options

### ThemeConfig

A class for managing collections of theme options.

#### Properties

- `themes`: Array of available theme options
- `defaultTheme`: The default theme to apply if none is selected

#### Methods

- `static create(themes: ThemeOption[], defaultThemeIndex?: number): ThemeConfig` - Factory method to create theme configuration

### ThemeAndModeSetup

A utility class for configuring theme providers.

#### Methods

- `static getThemeProviders(config: ThemeConfig): Provider[]` - Returns Angular providers for theme configuration

## Dynamic Setup

### Otional Themes

Consider adding seasonal themes that can be conditionally enabled:

```typescript
// Check if it's the Christmas season
const today = new Date();
const isChristmasSeason = today.getMonth() === 11;

// Conditional theme options
const themeOptions = [
  // Regular themes...
];

// Add seasonal theme if appropriate
if (isChristmasSeason) {
  themeOptions.push(
    ThemeOption.create({
      darkMode: false,
      label: 'Christmas',
      value: 'xmas',
      primaryColor: '#C8102E', // Red
      secondaryColor: '#006747', // Green
    })
  );
}


```

### Consistent Theme Values

Use the `value` property to create CSS class names for additional custom styling.

### Predefined Color Schemes

Consider creating a palette of predefined color combinations that work well together.