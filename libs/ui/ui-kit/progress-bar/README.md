# SbProgressBarComponent

A simple, standalone Angular progress bar component inspired by Angular Material.

## Features
- Standalone Angular component
- Supports `determinate` and `indeterminate` modes
- Theme color support: `primary`, `secondary`, `tertiary`, `error` (Material theme tokens)
- Animates indeterminate mode
- Uses Angular signal-based inputs

## Usage

```html
<!-- Determinate mode -->
<sb-progress-bar [value]="50" [mode]="'determinate'" [color]="'primary'"></sb-progress-bar>

<!-- Indeterminate mode -->
<sb-progress-bar [mode]="'indeterminate'" [color]="'secondary'"></sb-progress-bar>
```

### Inputs
- `value`: number (0-100, only for determinate mode, default: 0)
- `mode`: `'determinate' | 'indeterminate'` (default: `'indeterminate'`)
- `color`: `'primary' | 'secondary' | 'tertiary' | 'error'` (default: `'primary'`)

### Theming
- The color input sets a Material theme class on the host (`primary`, `secondary`, `tertiary`, `error`).
- You can extend the SCSS for custom colors if needed.

### Example (with Angular signals)
```typescript
// In your component:
progress = signal(30);

// In template:
<sb-progress-bar [value]="progress()" [mode]="'determinate'" [color]="'primary'"></sb-progress-bar>
```

## Styling
- The progress bar uses CSS custom properties for color theming.
- Indeterminate mode animates the fill bar.

---

For more, see the source code and SCSS for advanced customization.
