# SbProgressBarComponent

A simple, standalone Angular progress bar component inspired by Angular Material.

## Usage

```html
<sb-progress-bar [value]="50" mode="determinate" color="#3f51b5"></sb-progress-bar>
<sb-progress-bar mode="indeterminate" color="red"></sb-progress-bar>
```

- `value`: number (0-100, only for determinate mode)
- `mode`: 'determinate' | 'indeterminate'
- `color`: any valid CSS color
