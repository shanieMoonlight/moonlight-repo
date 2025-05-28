# @spider-baby/ui-toast

A modern, accessible toast notification library for Angular applications.

## Features

- 🎯 **Type-safe** - Full TypeScript support with comprehensive types
- ♿ **Accessible** - WCAG compliant with proper ARIA labels and keyboard navigation
- 🎨 **Customizable** - Flexible theming and styling options
- 📱 **Responsive** - Works great on all screen sizes
- 📍 **Flexible Positioning** - 3x3 grid positioning system (top/center/bottom × left/center/right)
- 🔄 **Queue Management** - Smart stacking and queue handling
- ⚡ **Performance** - Optimized with OnPush change detection
- 🧩 **Standalone** - Works with both standalone and NgModule approaches

## Installation

```bash
npm install @spider-baby/ui-toast
```

## Quick Start

### 1. Setup Configuration

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { ToastSetup, matToastConfig } from '@spider-baby/ui-toast/setup';

bootstrapApplication(AppComponent, {
  providers: [
    ToastSetup.getProviders(matToastConfig),
    // ... other providers
  ]
});
```

### 2. Inject and Use Service

```typescript
import { Component, inject } from '@angular/core';
import { ToastService, ToastData } from '@spider-baby/ui-toast';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="showSuccess()">Show Success</button>
    <button (click)="showError()">Show Error</button>
  `
})
export class ExampleComponent {
  private toast = inject(ToastService);

  showSuccess() {
    this.toast.success('Operation completed successfully!');
  }

  showError() {
    this.toast.error('Something went wrong!', 8000);
  }
}
```

## API Reference

### ToastService Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `success(message, duration?)` | Show success toast | `string, number?` | `ToastRef` |
| `error(message, duration?)` | Show error toast | `string, number?` | `ToastRef` |
| `warning(message, duration?)` | Show warning toast | `string, number?` | `ToastRef` |
| `info(message, duration?)` | Show info toast | `string, number?` | `ToastRef` |
| `show(data, duration?)` | Show custom toast | `ToastData, number?` | `ToastRef` |
| `clearAll()` | Clear all active toasts | - | `void` |
| `getActiveCount()` | Get number of active toasts | - | `number` |

#### Positioning Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `showTopLeft(message, type?, duration?)` | Show toast at top-left | `string, ToastType?, number?` | `ToastRef` |
| `showTopRight(message, type?, duration?)` | Show toast at top-right | `string, ToastType?, number?` | `ToastRef` |
| `showTopCenter(message, type?, duration?)` | Show toast at top-center | `string, ToastType?, number?` | `ToastRef` |
| `showBottomLeft(message, type?, duration?)` | Show toast at bottom-left | `string, ToastType?, number?` | `ToastRef` |
| `showBottomRight(message, type?, duration?)` | Show toast at bottom-right | `string, ToastType?, number?` | `ToastRef` |
| `showBottomCenter(message, type?, duration?)` | Show toast at bottom-center | `string, ToastType?, number?` | `ToastRef` |
| `showCenter(message, type?, duration?)` | Show toast at true center (overlays) | `string, ToastType?, number?` | `ToastRef` |

### Positioning System

The toast library supports a flexible 3×3 positioning grid:

```
┌─────────────┬─────────────┬─────────────┐
│  top-left   │ top-center  │ top-right   │
├─────────────┼─────────────┼─────────────┤
│center-left  │   center    │center-right │
├─────────────┼─────────────┼─────────────┤
│bottom-left  │bottom-center│bottom-right │
└─────────────┴─────────────┴─────────────┘
```

**Stacking Behavior:**
- Toasts in the same position stack vertically with proper spacing
- Center-center toasts overlay each other (use for critical messages)
- Different positions don't interfere with each other

**Usage Examples:**
```typescript
// Using positioning methods
this.toast.showTopLeft('Top left success', 'success');
this.toast.showCenter('Critical error!', 'error');

// Using ToastData with positioning
const toast = new ToastData('info', 'Custom message', {
  positionVertical: 'bottom',
  positionHorizontal: 'center',
  duration: 5000
});
this.toast.show(toast);

// Using factory methods
const centerToast = ToastData.Center('warn', 'Warning message');
this.toast.show(centerToast);
```

### Toast Types

- `success` - Green toast for successful operations
- `error` - Red toast for errors and failures  
- `warn` - Orange toast for warnings
- `info` - Blue toast for informational messages

### Configuration

```typescript
import { ToastConfig } from '@spider-baby/ui-toast/setup';

const customConfig = ToastConfig.create({
  colorBgSuccess: '#4caf50',
  colorBgError: '#f44336',
  colorBgWarn: '#ff9800',
  colorBgInfo: '#2196f3',
  colorText: '#ffffff',
  positionConfig: {
    topPx: 20,
    rightPx: 20,
    bottomPx: 20,
    leftPx: 20
  },
  animationConfig: {
    fadeInMs: 300,
    fadeOutMs: 200
  }
});
```

## Advanced Usage

### Custom Toast with Actions

```typescript
const toastData = ToastData.Create('info', 'File uploaded successfully', {
  actions: [
    {
      label: 'View',
      action: () => this.viewFile(),
      color: 'primary'
    },
    {
      label: 'Share',
      action: () => this.shareFile(),
      color: 'accent'
    }
  ]
});

this.toast.show(toastData, 10000);
```

### Custom Styling

```scss
// Override toast colors
:root {
  --toast-success-bg: #10b981;
  --toast-error-bg: #ef4444;
  --toast-warn-bg: #f59e0b;
  --toast-info-bg: #3b82f6;
}
```

## Running unit tests

Run `nx test spider-baby-ui-toast` to execute the unit tests.
