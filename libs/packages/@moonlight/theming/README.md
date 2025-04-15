# @moonlight/theming

Angular library that provides theme and dark/light mode management with SSR support.

## Features

- 🌓 Light/dark mode toggle with system preference detection
- 🎨 Multiple theme support
- 💾 Persistent theme preferences
- 🖥️ Server-side rendering compatible
- 📱 Reactive state with RxJS and Signals

## Installation

```bash
    npm install @moonlight/theming


# Basic Usage

import { ThemeService } from '@moonlight/theming';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button (click)="toggleDarkMode()">
# @moonlight/theming

Angular library that provides theme and dark/light mode management with SSR support.

## Features

- 🌓 Light/dark mode toggle with system preference detection
- 🎨 Multiple theme support
- 💾 Persistent theme preferences
- 🖥️ Server-side rendering compatible
- 📱 Reactive state with RxJS and Signals

## Installation
      {{ isDark() ? '🌙' : '☀️' }}
    </button>
    <div class="theme-switcher">
      <button *ngFor="let theme of themes" 
              (click)="setTheme(theme.idx)">
        {{ theme.name }}
      </button>
    </div>
  `
})
export class ThemeToggleComponent {
  constructor(private themeService: ThemeService) {}
  
  isDark = this.themeService.isDarkMode;
  currentTheme = this.themeService.themeIdx;
  
  toggleDarkMode(): void {
    this.themeService.setDarkMode(!this.isDark());
  }
  
  setTheme(idx: string | number): void {
    this.themeService.setThemeIndex(idx);
  }
}


# Configuration
## Create a theme configuration:

import { ThemeConfig, ThemeAndModeSetup } from '@moonlight/theming/config';

const myConfig = ThemeConfig.Create({
  themeOptions: [
    { name: 'Default', classIdx: 'default' },
    { name: 'Ocean', classIdx: 'ocean' },
    { name: 'Desert', classIdx: 'desert' }
  ],
  darkModeClass: 'dark-theme',
  lightModeClass: 'light-theme',
  themeClassPrefix: 'theme',
  defaultMode: 'light'
});

@NgModule({
  providers: [
    ThemeAndModeSetup.getThemeProviders(myConfig)
  ]
})
export class AppModule {}



# CSS Setup

/* Light/dark mode classes */
.light-theme {
  --background: #ffffff;
  --text: #333333;
}

.dark-theme {
  --background: #1a1a1a;
  --text: #f0f0f0;
}

/* Theme variations */
.theme-default {
  --primary: #3f51b5;
  --accent: #ff4081;
}

.theme-ocean {
  --primary: #0277bd;
  --accent: #00b0ff;
}

.theme-desert {
  --primary: #ff9800;
  --accent: #ff5722;
}
