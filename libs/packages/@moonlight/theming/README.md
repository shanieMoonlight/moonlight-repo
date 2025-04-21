# @moonlight/theming

Angular library that provides theme and dark/light mode management with SSR support.

---

## Features

- 🌓 **Light/Dark Mode**: Toggle between light, dark, or system-preferred modes
- 🎨 **Multiple Themes**: Support for multiple themes with customizable colors
- 💾 **Persistent Preferences**: Save and restore user theme preferences
- 🖥️ **SSR Compatible**: Works seamlessly with server-side rendering
- 📱 **Reactive State**: Built with RxJS and Angular Signals for reactivity
- 🛠️ **Customizable**: Extendable configuration and theming options

---

## Installation

Install the library via npm:

```bash
npm install @moonlight/ng/theming
```

---

## Usage

### 1. Basic Theme Toggle

```typescript
import { ThemeService } from '@moonlight/material/theming/service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button (click)="toggleDarkMode()">
      {{ isDark() ? '🌙' : '☀️' }}
    </button>
  `
})
export class ThemeToggleComponent {
  constructor(private themeService: ThemeService) {}

  isDark = this.themeService.isDarkMode;

  toggleDarkMode(): void {
    this.themeService.setDarkMode(!this.isDark());
  }
}
```

### 2. Theme Selector with Live Preview

```html
<ml-theme-selector></ml-theme-selector>
<ml-theme-showcase></ml-theme-showcase>
```

---

## Configuration

### Define Themes

Create a theme configuration file:

```typescript
import { ThemeConfig, ThemeOption } from '@moonlight/material/theming/config';

export const THEME_CONFIG = ThemeConfig.create([
  ThemeOption.create({
    value: 'default',
    label: 'Default',
    primaryColor: '#3f51b5',
    secondaryColor: '#ff4081',
    darkMode: 'system'
  }),
  ThemeOption.create({
    value: 'ocean',
    label: 'Ocean',
    primaryColor: '#0277bd',
    secondaryColor: '#00b0ff',
    darkMode: false
  })
]);
```

### Provide Theme Configuration

Add the configuration to your app module:

```typescript
import { ThemeAndModeSetup } from '@moonlight/material/theming/config';
import { THEME_CONFIG } from './config/app-theme.config';

@NgModule({
  providers: [
    ThemeAndModeSetup.getThemeProviders(THEME_CONFIG)
  ]
})
export class AppModule {}
```

---

## CSS Setup

Define light/dark mode and theme-specific styles:

```css
/* Light/Dark Mode */
.light-theme {
  --background: #ffffff;
  --text: #333333;
}

.dark-theme {
  --background: #1a1a1a;
  --text: #f0f0f0;
}

/* Theme Variations */
.theme-default {
  --primary: #3f51b5;
  --accent: #ff4081;
}

.theme-ocean {
  --primary: #0277bd;
  --accent: #00b0ff;
}
```

---

## Related Entry Points

- `@moonlight/material/theming/config` – Theme configuration utilities
- `@moonlight/material/theming/service` – Core theme generation and application services
- `@moonlight/material/theming/selector` – Theme selection UI component
- `@moonlight/material/theming/components` – Theme/dark mode toggle UI components
- `@moonlight/material/theming/showcase` – Live theme preview components

---

## License

MIT
