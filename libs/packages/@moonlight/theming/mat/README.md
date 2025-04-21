# @moonlight/material/theming/components

UI components for theme switching and dark mode, built with Angular Material.

## Overview

This entry point provides reusable Angular components for theme management in applications using the Moonlight theming system and Angular Material. It includes ready-to-use UI elements for toggling dark mode, switching themes, and previewing theme changes.

## Features

- **Dark Mode Toggle**: Easily switch between light and dark themes
- **Theme Switcher**: UI for selecting among available themes
- **Material Design**: All components use Angular Material for a consistent look and feel
- **Accessible**: Keyboard and screen reader friendly

## Installation

This entry point is included with the main package:

```bash
npm install @moonlight/ng/theming
```

## Usage

Import the components you need in your Angular module:

```typescript
import { DarkModeToggleComponent, ThemeSwitcherComponent } from '@moonlight/material/theming/components';

@NgModule({
  declarations: [
    // ...other components
    DarkModeToggleComponent,
    ThemeSwitcherComponent
  ],
  // ...existing code...
})
export class AppModule {}
```

Or use as standalone components in your templates:

```html
<ml-dark-mode-toggle></ml-dark-mode-toggle>
<ml-theme-switcher></ml-theme-switcher>
```

## Example

```html
<header>
  <ml-theme-switcher></ml-theme-switcher>
  <ml-dark-mode-toggle></ml-dark-mode-toggle>
</header>
```

## Accessibility

All components are designed to be accessible:
- Keyboard navigable
- Proper ARIA attributes
- Focusable and screen reader friendly

## Customization

- Components use Angular Material theming and inherit your app's palette
- You can extend or style components using standard Angular and Material techniques

## Related Entry Points

- `@moonlight/ng/theming/config` – Theme configuration utilities
- `@moonlight/ng/theming/service` – Core theme generation and application services
- `@moonlight/ng/theming/selector` – Theme selection UI components

## License

MIT