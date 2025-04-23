# @moonlight/material/theming/showcase

Secondary entry point of `@moonlight/material/theming`. Import from `@moonlight/material/theming/showcase` to use the theme showcase and demo components.

---

## Overview

The `/showcase` entry point provides Angular components for visually demonstrating how your selected theme applies to a wide range of Angular Material UI elements. It's designed to be used alongside the theme selector components so users can instantly preview the effects of different theme settings on real Material components.

This is ideal for:
- Theme designers and developers who want to see live previews of their theme changes
- Application users who want to choose or customize a theme and immediately see the results
- Documentation and style guides to demonstrate the available themes

---

## Features

- **Comprehensive Material Demo**: Showcases buttons, form fields, selects, checkboxes, radios, tabs, cards, progress indicators, and more
- **Live Theme Preview**: Instantly reflects changes made via the theme selector
- **Dark Mode Support**: Shows components in both light and dark mode contexts
- **Variety of Component States**: Demonstrates enabled, disabled, active, and hover states
- **Easy Integration**: Drop into any application page for instant visual feedback
- **Material Design**: Uses Angular Material components for a realistic preview
- **Responsive Layout**: Adapts to different screen sizes for mobile and desktop use

---

## Installation

This entry point is included with the main package:

```bash
npm install @moonlight/material/theming
```

---

## Usage

Import the showcase component as a standalone component:

```typescript
import { ThemeShowcaseMatComponent } from '@moonlight/material/theming/showcase';

@Component({
  selector: 'app-theme-demo',
  template: `
    <h1>Theme Preview</h1>
    <ml-theme-showcase-mat></ml-theme-showcase-mat>
  `,
  standalone: true,
  imports: [ThemeShowcaseMatComponent]
})
export class ThemeDemoComponent {}
```

### Example Integration with Theme Selector

```html
<div class="settings-container">
  <mat-card>
    <mat-card-header>
      <mat-card-title>Customize Theme</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <ml-theme-selector></ml-theme-selector>
    </mat-card-content>
  </mat-card>
  
  <mat-card>
    <mat-card-header>
      <mat-card-title>Preview</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <ml-theme-showcase-mat></ml-theme-showcase-mat>
    </mat-card-content>
  </mat-card>
</div>
```

### Custom Configuration

The showcase component can be configured to show specific component sets:

```html
<ml-theme-showcase-mat 
  [showButtons]="true"
  [showInputs]="true"
  [showIndicators]="false"
  [showCards]="true">
</ml-theme-showcase-mat>
```

---

## Component API

### ThemeShowcaseMatComponent

A complete showcase of Material Design components with the current theme applied.

#### Inputs

- `[showButtons]`: boolean - Whether to show button components. Default: `true`
- `[showInputs]`: boolean - Whether to show form input components. Default: `true` 
- `[showSelects]`: boolean - Whether to show select components. Default: `true`
- `[showCheckboxes]`: boolean - Whether to show checkbox and radio components. Default: `true`
- `[showCards]`: boolean - Whether to show card components. Default: `true`
- `[showTabs]`: boolean - Whether to show tab components. Default: `true`
- `[showIndicators]`: boolean - Whether to show progress indicators. Default: `true`
- `[showExpansion]`: boolean - Whether to show expansion panels. Default: `true`
- `[compact]`: boolean - Whether to use a compact layout. Default: `false`

---

## Customizing the Showcase

You can extend the showcase component to include your own custom components:

```typescript
import { Component } from '@angular/core';
import { ThemeShowcaseMatComponent } from '@moonlight/material/theming/showcase';

@Component({
  selector: 'app-extended-showcase',
  template: `
    <ml-theme-showcase-mat></ml-theme-showcase-mat>
    
    <div class="custom-components-showcase">
      <h3>Custom Components</h3>
      <!-- Your custom components here -->
      <app-custom-card></app-custom-card>
      <app-feature-tiles></app-feature-tiles>
    </div>
  `,
  standalone: true,
  imports: [ThemeShowcaseMatComponent]
})
export class ExtendedShowcaseComponent {}
```

---

## Integration with Hierarchical Theming

The showcase component automatically adapts to the current theme context, making it perfect for demonstrating section-specific themes in a hierarchical theming setup:

```typescript
import { Component, OnDestroy } from '@angular/core';
import { DynamicThemeConfigService, ThemeOption } from '@moonlight/material/theming/config';
import { ThemeShowcaseMatComponent } from '@moonlight/material/theming/showcase';
import { ThemeSelectorComponent } from '@moonlight/material/theming/customizer';

@Component({
  selector: 'app-section-theme-demo',
  template: `
    <h1>Section Themes</h1>
    <p>These themes are only available in this section of the app.</p>
    
    <ml-theme-selector></ml-theme-selector>
    <ml-theme-showcase-mat></ml-theme-showcase-mat>
  `,
  standalone: true,
  imports: [ThemeShowcaseMatComponent, ThemeSelectorComponent]
})
export class SectionThemeDemoComponent implements OnDestroy {
  constructor(private configService: DynamicThemeConfigService) {
    // Set section-specific themes
    this.configService.setSystemThemes([
      // Section-specific themes
    ]);
  }
  
  ngOnDestroy() {
    // Reset to application-wide themes
    this.configService.resetSystemThemesToInitial();
  }
}
```

---

## Best Practices

- Place the showcase near your theme selector for a seamless user experience
- Consider using tabs or expandable sections to organize the showcase if space is limited
- Use in documentation, style guides, or admin panels to preview theme changes
- For applications with custom components, extend the showcase to include your own components
- When using hierarchical theming, include a showcase in each section to demonstrate the available themes

---

## Related Entry Points

- `@moonlight/material/theming/customizer` – Theme selection and customization UI components
- `@moonlight/material/theming/components` – Theme/dark mode toggle UI components
- `@moonlight/material/theming/config` – Theme configuration utilities
- `@moonlight/material/theming/service` – Core theme generation and application services

---

## License

MIT
