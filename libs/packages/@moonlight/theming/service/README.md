# @moonlight/material/theming/service

Secondary entry point of `@moonlight/material/theming`. It can be used by importing from `@moonlight/material/theming/service`.

This entry point provides the `ThemeService`, the core service responsible for managing theme and dark/light mode settings within an Angular application.

## Features

-   **`ThemeService`**:
    -   Manages the current theme suffix (`themeSuffix`, `setThemeSuffix`).
    -   Manages the current dark/light mode (`isDarkMode`, `setDarkMode`).
    -   Provides reactive state through RxJS Observables (`isDarkMode$`, `themeSuffix$`) and Angular Signals (`isDarkMode`, `themeSuffix`).
    -   Persists the user's theme and mode preferences using `SsrLocalStorage`.
    -   Initializes the theme based on stored preferences, system settings (`prefers-color-scheme`), or configured defaults.
    -   Applies appropriate CSS classes to the document body for styling.
    -   Requires configuration via `ThemeConfig` provided through the main entry point (`@moonlight/material/theming/config`).
-   **`ThemeData`**: Interface defining the structure for storing theme preferences (`suffix` and `isDarkMode`).
-   **`ThemeSuffix`**: Type alias for the theme identifier (string or number).

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from '@moonlight/material/theming/service';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-theme-controls',
  standalone: true,
  imports: [AsyncPipe, NgFor], // Import necessary pipes/directives
  template: `
    <div>
      <p>Current Mode: {{ themeService.isDarkMode() ? 'Dark' : 'Light' }}</p>
      <button (click)="toggleMode()">
        Toggle {{ themeService.isDarkMode() ? 'Light' : 'Dark' }} Mode
      </button>
    </div>
    <div>
      <p>Current Theme Suffix: {{ themeService.themeSuffix() }}</p>
      <label>Select Theme Suffix:
        <select (change)="changeTheme($event)">
          <!-- Populate options based on your ThemeConfig -->
          <option value="0">Default (0)</option>
          <option value="ocean">Ocean</option>
          <option value="desert">Desert</option>
        </select>
      </label>
    </div>
  `
})
export class ThemeControlsComponent {
  themeService = inject(ThemeService);

  toggleMode(): void {
    this.themeService.setDarkMode(!this.themeService.isDarkMode());
  }

  changeTheme(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newSuffix = selectElement.value;
    // Potentially convert to number if your suffixes are numeric
    this.themeService.setThemeSuffix(newSuffix);
  }
}
```
## Important Note

Ensure `ThemeConfig` is properly provided in your application through one of these methods:
- In your root module providers
- In standalone component providers
- In your application's providers array

For detailed configuration instructions, refer to the main `@moonlight/theming` README.
