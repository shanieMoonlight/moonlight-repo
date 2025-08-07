# @spider-baby/material-theming/components

UI components for theme switching and dark mode, built with Angular Material.

## Overview

This entry point provides reusable Angular components for theme management in applications using the SpiderBaby theming system and Angular Material. It includes ready-to-use UI elements for toggling dark mode, switching themes, and previewing theme changes.

## Features

- **Dark Mode Toggle**: Easily switch between light, dark, and system-preference themes
- **Theme Transition Indicator**: Visual feedback during theme transitions
- **Fully Customizable**: Support for custom icons, labels, and styles
- **Material Design**: All components use Angular Material for a consistent look and feel
- **Accessible**: Keyboard and screen reader friendly

## Installation

This entry point is included with the main package:

```bash
npm install @spider-baby/material-theming
```

## Usage

Import the components you need in your Angular module or use as standalone components:

```typescript
import { DarkModeToggleMatComponent, ThemeTransitionIndicatorComponent } from '@spider-baby/material-theming/components';

@Component({
  // ...
  imports: [DarkModeToggleMatComponent, ThemeTransitionIndicatorComponent],
  // ...
})
export class AppComponent {}
```

## Dark Mode Toggle Component

The `DarkModeToggleMatComponent` provides a button or switch for controlling dark mode:

```html
<!-- As a simple icon button -->
<sb-dark-mode-toggle-mat></sb-dark-mode-toggle-mat>

<!-- With a visible switch -->
<sb-dark-mode-toggle-mat [hideSwitch]="false"></sb-dark-mode-toggle-mat>

<!-- With custom labels -->
<sb-dark-mode-toggle-mat 
  lightLabel="Light Mode" 
  darkLabel="Dark Mode"
  systemLabel="System Preference">
</sb-dark-mode-toggle-mat>
```

### API Reference

#### Properties
- `[hideSwitch]`: Boolean to control whether to show just the icon or the full switch. Default: `true`
- `[lightLabel]`: String for light mode label. Default: "Light"
- `[darkLabel]`: String for dark mode label. Default: "Dark"
- `[systemLabel]`: String for system preference label. Default: "System"
- `[startWithMenu]`: Boolean to control whether menu starts open. Default: `false`

## Theme Transition Indicator Component

The `ThemeTransitionIndicatorComponent` displays visual feedback during theme transitions, adding a professional touch to the user experience:

```html
<!-- Place at the app level for global theme transitions -->
<sb-theme-transition-indicator/>

<!-- With custom settings -->
<sb-theme-transition-indicator 
  [type]="'spinner'"
  [size]="'large'">
</sb-theme-transition-indicator>
```

### API Reference

#### Properties
- `[type]`: String to specify the type of indicator ('spinner', 'fade', 'ripple'). Default: 'spinner'
- `[size]`: String to specify the size ('small', 'medium', 'large'). Default: 'medium'
- `[fixed]`: Boolean to control whether the indicator is fixed to the viewport. Default: `true`

## Integration Example

```html
<div class="app-container">
  <header>
    <sb-dark-mode-toggle-mat [hideSwitch]="false"></sb-dark-mode-toggle-mat>
  </header>
  
  <main>
    <router-outlet></router-outlet>
  </main>
  
  <!-- Add transition indicator for smooth theme changes -->
  <sb-theme-transition-indicator/>
</div>
```

## Accessibility

All components are designed to be accessible:
- Keyboard navigable
- Proper ARIA attributes
- Focusable and screen reader friendly
- High-contrast mode support

## Customization

- Components use Angular Material theming and inherit your app's palette
- All text labels can be customized
- Visual appearance can be overridden with CSS

## Related Entry Points

- `@spider-baby/material-theming/config` – Theme configuration utilities
- `@spider-baby/material-theming/service` – Core theme generation and application services
- `@spider-baby/material-theming/customizer` – Theme selection and customization UI components

## License

MIT