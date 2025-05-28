# @spider-baby/ui-toast

A modern, accessible toast notification library for Angular applications.

## Features

- 🎯 **Type-safe** - Full TypeScript support with comprehensive types
- ♿ **Accessible** - WCAG compliant with proper ARIA labels and keyboard navigation
- 🎨 **Customizable** - Flexible theming and styling options
- 📱 **Responsive** - Works great on all screen sizes
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
    rightPx: 20
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
