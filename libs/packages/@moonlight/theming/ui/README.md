# @moonlight/material/theming/ui

Secondary entry point of `@moonlight/material/theming`. Import from `@moonlight/material/theming/ui` to use reusable UI components for theming.

---

## Overview

The `/ui` entry point provides reusable Angular Material UI components that are used across the Moonlight theming library. These components are designed to work seamlessly with the theming services and configuration utilities, but they can also be used independently in other applications.

Currently, this entry point includes the following component:

- **`MlThemeAvatarComponent`**: A visual representation of a theme, typically used in theme pickers, dialogs, or theme management interfaces.

---

## Features

- **Reusable UI**: Components designed for use in various parts of the Moonlight theming library.
- **Material Design**: Built with Angular Material for a consistent look and feel.
- **Customizable**: Easily extendable and adaptable for different use cases.

---

## Installation

This entry point is included with the main package:

```bash
npm install @moonlight/ng/theming
```

---

## Usage

### Import the Component

Add the `MlThemeAvatarComponent` to your module or use it as a standalone component:

```typescript
import { MlThemeAvatarComponent } from '@moonlight/material/theming/ui';

@NgModule({
  declarations: [MlThemeAvatarComponent],
  // ...other config
})
export class YourModule {}
```

### Example Usage

```html
<ml-theme-avatar [theme]="selectedTheme"></ml-theme-avatar>
```

---

## API Reference

### `MlThemeAvatarComponent`

#### Inputs

- **`theme`**: `ThemeOption`  
  The theme to display in the avatar.

#### Outputs

- None

---

## Best Practices

- Use `MlThemeAvatarComponent` in theme pickers, dialogs, or any UI where a visual representation of a theme is needed.
- Combine with `@moonlight/material/theming/customizer` or `@moonlight/material/theming/components` for a complete theming solution.

---

## Related Entry Points

- `@moonlight/material/theming/customizer` – Theme selection UI component
- `@moonlight/material/theming/components` – Theme/dark mode toggle UI components
- `@moonlight/material/theming/service` – Core theme generation and application services

---

## License

MIT
