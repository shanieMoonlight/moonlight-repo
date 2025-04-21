# @moonlight/material/theming/selector

Secondary entry point of `@moonlight/material/theming`. Import from `@moonlight/material/theming/selector` to use the theme selector UI component.

---

## Overview

The `/selector` entry point provides the `MlThemeSelectorComponent`, a powerful and user-friendly Angular Material UI for creating, previewing, and managing application themes. It allows users to:

- Select and preview preset themes
- Customize primary, secondary, tertiary, and error colors
- Choose light, dark, or system theme modes
- Name and save custom themes
- Instantly preview theme changes in the browser
- Export theme SCSS for use in stylesheets

This component is ideal for applications that want to offer end-users or developers a rich theme customization experience.

---

## Features

- **Material Design**: Built with Angular Material for a modern look and feel
- **Live Preview**: Instantly applies theme changes to the application for real-time feedback
- **Preset Themes**: Quickly preview and select from a set of predefined themes
- **Custom Theme Creation**: Users can create, name, and save their own themes
- **Color Pickers**: Easy-to-use color inputs for all theme colors
- **Dark/Light/System Mode**: Toggle between light, dark, or system-preferred color schemes
- **SCSS Export**: Export the current theme as SCSS variables for further customization
- **Accessibility**: Keyboard and screen reader friendly

---

## Installation

This entry point is included with the main package:

```bash
npm install @moonlight/ng/theming
```

---

## Usage

### 1. Import the Component

Add the selector module to your feature or app module:

```typescript
import { MlThemeSelectorComponent } from '@moonlight/material/theming/selector';

@NgModule({
  declarations: [MlThemeSelectorComponent],
  // or use as a standalone component if supported
})
export class YourModule {}
```

### 2. Use in Your Template

```html
<ml-theme-selector></ml-theme-selector>
```

### 3. Provide Theme Configuration

Make sure you have set up your theme configuration using `@moonlight/material/theming/config` and provided it in your app's providers.

---

## Example

<!-- You can add a screenshot here if desired -->

```html
<ml-theme-selector></ml-theme-selector>
```

---

## API

### `<ml-theme-selector>`

#### Inputs

- `presetThemes` (optional): `ThemeOption[]`  
  Provide a custom list of preset themes to display.

#### Outputs

- All theme changes are applied live; custom events can be added as needed.

---

## Best Practices

- Place the theme selector in a settings or customization area of your app.
- Use with the dark mode toggle and theme switcher components for a complete theming solution.
- Encourage users to save and name their custom themes for easy reuse.

---

## Related Entry Points

- `@moonlight/material/theming/config` – Theme configuration utilities
- `@moonlight/material/theming/components` – Theme/dark mode toggle UI components
- `@moonlight/material/theming/service` – Core theme generation and application services

---

## License

MIT
