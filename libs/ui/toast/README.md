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
- 🏗️ **CDK-Powered** - Built on Angular CDK overlay for robust positioning

## Installation

### 1. Install the Package

```bash
npm install @spider-baby/ui-toast
```

### 2. Install Required Dependencies

The toast library depends on Angular CDK for overlay functionality. **This is required even if you don't use Angular Material elsewhere in your project.**

```bash
npm install @angular/cdk
```

> 💡 **Why CDK?** The library uses `@angular/cdk/overlay` to position toasts correctly across different screen sizes and positions. This is a core Angular CDK module, not specific to Material Design.

### 3. Import Required CSS

**⚠️ CRITICAL STEP**: Add the Angular CDK overlay CSS to your project. **Toasts will not display correctly without this CSS.**

The CDK overlays depend on a small set of structural styles to work correctly. If you're using Angular Material, these styles have been included together with the theme, otherwise if you're using the CDK on its own, you'll have to include the styles yourself. You can do so by importing the prebuilt styles in your global stylesheet:

**Option A: In `angular.json` (Recommended)**
```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@angular/cdk/overlay-prebuilt.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

**Option B: In `styles.css` or `styles.scss`**
```css
@import '@angular/cdk/overlay-prebuilt.css';
```

**Option C: In `index.html`**
```html
<link href="node_modules/@angular/cdk/overlay-prebuilt.css" rel="stylesheet">
```

> 🚨 **Common Issue**: If you skip this step, toasts may appear with no styling, broken positioning, or may not appear at all. See the [Troubleshooting](#troubleshooting) section if you encounter display issues.

## Quick Start

### Prerequisites Checklist

Before using the toast library, ensure you have completed ALL of these installation steps:

- ✅ Installed `@spider-baby/ui-toast`
- ✅ Installed `@angular/cdk` 
- ✅ **Added `@angular/cdk/overlay-prebuilt.css` to your project** ⚠️ 
- ✅ Configured animations with `provideAnimations()`

> 🚨 **Most Common Issue**: Forgetting to import the CDK overlay CSS. This will cause toasts to not display or appear broken.

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

**Note:** The library uses the `TOAST_CONFIG_TOKEN` injection token to provide configuration. If no configuration is provided, default values will be used.

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

## Complete Setup Example

Here's a complete example showing all required setup steps:

**main.ts** (Standalone Angular App)
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastSetup, matToastConfig } from '@spider-baby/ui-toast/setup';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // Required for toast animations
    provideAnimations(),
    
    // Toast configuration
    ToastSetup.getProviders(matToastConfig),
    
    // ... other providers
  ]
}).catch(err => console.error(err));
```

**styles.css** (Global Styles)
```css
/* Required for Angular CDK overlays */
@import '@angular/cdk/overlay-prebuilt.css';

/* Your other global styles */
body {
  margin: 0;
  font-family: Roboto, sans-serif;
}
```

**app.component.ts**
```typescript
import { Component, inject } from '@angular/core';
import { ToastService } from '@spider-baby/ui-toast';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Toast Demo</h1>
    <button (click)="showToast()">Show Toast</button>
  `
})
export class AppComponent {
  private toast = inject(ToastService);
  
  showToast() {
    this.toast.success('Hello from Toast!');
  }
}
```

## API Reference

### ToastService Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `success(message, duration?, options?)` | Show success toast (default: 5000ms) | `string, number?, ToastOptions?` | `ToastRef` |
| `error(message, duration?, options?)` | Show error toast (default: 8000ms) | `string, number?, ToastOptions?` | `ToastRef` |
| `warning(message, duration?, options?)` | Show warning toast (default: 6000ms) | `string, number?, ToastOptions?` | `ToastRef` |
| `info(message, duration?, options?)` | Show info toast (default: 5000ms) | `string, number?, ToastOptions?` | `ToastRef` |
| `show(data, duration?)` | Show custom toast | `ToastData, number?` | `ToastRef` |
| `clearAll()` | Clear all active toasts | - | `void` |
| `getActiveCount()` | Get number of active toasts | - | `number` |
| `showMsg(message, type?, duration?)` | Legacy method for showing any toast type | `string, ToastType?, number?` | `ToastRef` |

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
// Using standard service methods with positioning via ToastData
this.toast.success('Operation completed!', 5000, {
  positionVertical: 'top',
  positionHorizontal: 'left'
});

// Using ToastData with positioning methods (fluent API)
const topLeftToast = ToastData
  .Success('Top left success!')
  .positionTopLeft();
this.toast.show(topLeftToast);

// Using ToastData with positioning in constructor
const toast = new ToastData('info', 'Custom message', {
  positionVertical: 'bottom',
  positionHorizontal: 'center',
  duration: 5000
});
this.toast.show(toast);
```

### Animation System

The toast library supports multiple animation types that can be configured at runtime:

**Available Animations:**
- `fade` - Simple opacity fade in/out (default)
- `slide` - Slide down from top / slide up to top  
- `scale` - Scale from small to normal / scale down to small
- `bounce` - Bounce down from top with elastic effect

**Usage Examples:**
```typescript
// Using ToastData with animation methods (fluent API)
const slideToast = ToastData
  .Info('Sliding message!')
  .withSlide();
this.toast.show(slideToast);

const bounceToast = ToastData
  .Success('Bouncy success!')
  .withBounce();
this.toast.show(bounceToast);

// Using ToastData with animation type in constructor
const animatedToast = new ToastData('error', 'Custom animated message', {
  animationType: 'bounce',
  positionVertical: 'top',
  positionHorizontal: 'center'
});
this.toast.show(animatedToast);

// Combining positioning and animations with fluent API
const toast = ToastData
  .Warning('Bottom corner slide!')
  .positionBottomRight()
  .withSlide();
this.toast.show(toast);
```

### ToastOptions Interface

```typescript
interface ToastOptions {
  duration?: number;                      // Auto-dismiss time in milliseconds
  dismissible?: boolean;                  // Whether user can dismiss manually (default: true)
  positionVertical?: 'top' | 'bottom' | 'center';    // Vertical positioning (default: 'top')
  positionHorizontal?: 'left' | 'right' | 'center';  // Horizontal positioning (default: 'right')
  showIcon?: boolean;                     // Show type-based icon (default: true)
  animationType?: 'fade' | 'slide' | 'scale' | 'bounce'| 'wobble' | 'spin' | 'rubber';  // Animation type (default: 'fade')
}
```

### ToastData Factory Methods

The `ToastData` class provides several static factory methods for creating toast instances:

```typescript
// Basic factory methods
ToastData.Create(type, text, options?)      // Generic factory
ToastData.Success(text, options?)           // Success toast
ToastData.Error(text, options?)             // Error toast  
ToastData.Warning(text, options?)           // Warning toast
ToastData.Info(text, options?)              // Info toast
```

### ToastData Fluent API

The `ToastData` class supports method chaining for positioning and animations:

```typescript
// Positioning methods
.positionTopLeft()         // Position at top-left
.positionTopCenter()       // Position at top-center  
.positionTopRight()        // Position at top-right
.positionBottomLeft()      // Position at bottom-left
.positionBottomCenter()    // Position at bottom-center
.positionBottomRight()     // Position at bottom-right
.positionCenter()          // Position at center (overlay)

// Animation methods  
.withFade()               // Use fade animation
.withSlide()              // Use slide animation
.withScale()              // Use scale animation
.withBounce()             // Use bounce animation
.withWobble()             // Use wobble animation
.withRubber()             // Use rubber animation
.withSpin()               // Use spin animation

// Example: Chaining positioning and animation
const toast = ToastData
  .Success('Operation completed!')
  .positionBottomCenter()
  .withBounce();
```

### Toast Types

The library supports four toast types, each with different default durations:

- **`success`** - Green toast for successful operations (default: 5000ms)
- **`error`** - Red toast for errors and failures (default: 8000ms)
- **`warn`** - Orange toast for warnings (default: 6000ms)  
- **`info`** - Blue toast for informational messages (default: 5000ms)

**Note:** Default durations are automatically applied when using the convenience methods (`success()`, `error()`, etc.). When using `show()` directly, you must specify the duration explicitly or the toast will not auto-dismiss.

### Configuration

You can customize the toast library by providing a custom configuration:

```typescript
import { ToastConfig, ToastPositionConfig, ToastAnimationConfig } from '@spider-baby/ui-toast/setup';

// Create custom configuration using factory method
const customConfig = ToastConfig.Create(
  '#ff0000',  // colorBgError
  '#ff9800',  // colorBgWarn  
  '#4caf50',  // colorBgSuccess
  '#2196f3',  // colorBgInfo
  '#ffffff',  // colorBgDefault
  '#212121',  // colorText
  ToastPositionConfig.Create(30, 30, 30, 30), // custom positioning
  ToastAnimationConfig.Create(600, 400)       // custom animation timing
);

// Or use fluent API for configuration
const fluentConfig = ToastConfig.Create()
  .setColorBgSuccess('#10b981')
  .setColorBgError('#ef4444')
  .setColorText('#1f2937')
  .setPositionConfig(ToastPositionConfig.Create(20, 20, 20, 20))
  .setAnimationConfig(ToastAnimationConfig.Create(500, 300));

// Apply configuration in your module
bootstrapApplication(AppComponent, {
  providers: [
    ToastSetup.getProviders(customConfig),
    // ... other providers
  ]
});
```

#### ToastConfig Methods

The `ToastConfig` class supports method chaining for easy configuration:

```typescript
// Color setters (return ToastConfig for chaining)
.setColorBgError(color)      // Set error background color
.setColorBgWarn(color)       // Set warning background color  
.setColorBgSuccess(color)    // Set success background color
.setColorBgInfo(color)       // Set info background color
.setColorBgDefault(color)    // Set default background color
.setColorText(color)         // Set text color

// Text color setters (with null coalescing support)
.setColorTxtError(color)     // Set error text color
.setColorTxtWarn(color)      // Set warning text color
.setColorTxtSuccess(color)   // Set success text color  
.setColorTxtInfo(color)      // Set info text color

// Configuration object setters
.setPositionConfig(config)   // Set positioning configuration
.setAnimationConfig(config)  // Set animation configuration
```

#### Position and Animation Configuration

```typescript
// Position configuration (margins from edges)
const positionConfig = ToastPositionConfig.Create(
  20,  // topPx - pixels from top
  20,  // rightPx - pixels from right
  20,  // bottomPx - pixels from bottom  
  20   // leftPx - pixels from left
);

// Animation configuration (timing in milliseconds)
const animationConfig = ToastAnimationConfig.Create(
  500,  // leaveMs - exit animation duration
  350   // enterMs - enter animation duration
);
```

## Advanced Usage

### Using Service Methods with Options

```typescript
// Success toast with custom positioning and animation
this.toast.success('File uploaded successfully!', 6000, {
  positionVertical: 'bottom',
  positionHorizontal: 'center',
  animationType: 'bounce'
});

// Error toast with custom settings
this.toast.error('Upload failed!', 8000, {
  positionVertical: 'top',
  positionHorizontal: 'center', 
  dismissible: false,
  showIcon: true
});
```

### Using ToastData Fluent API

```typescript
// Create and show a complex toast with method chaining
const complexToast = ToastData
  .Warning('Complex operation completed with warnings')
  .positionBottomRight()
  .withSlide();

this.toast.show(complexToast, 10000);

// Multiple positioning and animation combinations
const fadeToast = ToastData.Info('Fade message').positionTopCenter().withFade();
const bounceToast = ToastData.Success('Bounce message').positionCenter().withBounce();
const scaleToast = ToastData.Error('Scale message').positionBottomLeft().withScale();
```

### Managing Active Toasts

```typescript
// Get count of active toasts
const activeCount = this.toast.getActiveCount();
console.log(`Currently showing ${activeCount} toasts`);

// Clear all active toasts
this.toast.clearAll();

// Show toast and get reference for manual control
const toastRef = this.toast.success('Manual control toast');
setTimeout(() => {
  toastRef.close(); // Manually close after 3 seconds
}, 3000);
```

### Custom Styling

Override toast colors using CSS custom properties or by providing a custom configuration:

```scss
// Option 1: CSS custom properties (if supported by your theme)
:root {
  --toast-success-bg: #10b981;
  --toast-error-bg: #ef4444;
  --toast-warn-bg: #f59e0b;
  --toast-info-bg: #3b82f6;
  --toast-text: #1f2937;
}

// Option 2: Target toast components directly
.toast {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  .toast-text {
    font-weight: 500;
  }
  
  #icon {
    opacity: 0.8;
  }
}
```

```typescript
// Option 3: Programmatic configuration (recommended)
const customColors = ToastConfig.Create()
  .setColorBgSuccess('#10b981')
  .setColorBgError('#ef4444') 
  .setColorBgWarn('#f59e0b')
  .setColorBgInfo('#3b82f6')
  .setColorText('#1f2937');
```

## API Reference Summary

### Core Classes

- **`ToastService`** - Main service for showing and managing toasts
- **`ToastData`** - Data model with factory methods and fluent API
- **`ToastRef`** - Reference to individual toast instances
- **`ToastConfig`** - Configuration class with fluent API
- **`ToastPositionConfig`** - Positioning configuration
- **`ToastAnimationConfig`** - Animation timing configuration

### Key Features

- **🎯 Type Safety** - Full TypeScript support with comprehensive interfaces
- **🔗 Method Chaining** - Fluent APIs for ToastData and ToastConfig  
- **📍 Flexible Positioning** - 3×3 grid system with fine-grained control
- **🎬 Rich Animations** - Four animation types with customizable timing
- **⚙️ Comprehensive Configuration** - Colors, positioning, and animations
- **📊 Toast Management** - Active count tracking and bulk operations

## Dynamic Configuration with ToastDynamicSetup

For scenarios where you need different toast configurations in different areas of your application (different routes, components, or modules), you can use the `ToastDynamicSetup` class to create scoped toast service instances with their own configurations.

### Why Use Dynamic Setup?

- **Route-Specific Configuration** - Different routes can have different toast positioning/styling
- **Component-Scoped Toasts** - Individual components can override global toast behavior  
- **Modular Applications** - Different modules can have distinct toast appearances

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { ToastDynamicSetup } from '@spider-baby/ui-toast/dynamic-provider';
import { matToastConfig, ToastPositionConfig } from '@spider-baby/ui-toast/setup';

@Component({
  selector: 'app-special-component',
  providers: [
    // This component gets its own toast service instance with custom config
    ...ToastDynamicSetup.getProviders(
      matToastConfig.setPositionConfig(
        ToastPositionConfig.Create(undefined, undefined, 300, undefined) // 300px from right
      )
    )
  ],
  template: `
    <button (click)="showToast()">Show Custom Positioned Toast</button>
  `
})
export class SpecialComponent {
  constructor(private toast: ToastService) {} // Gets component-scoped instance
  
  showToast() {
    // This toast will appear 300px from the right edge
    this.toast.success('Custom positioned toast!');
  }
}
```

### Route-Level Configuration

```typescript
// In your routing configuration
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    providers: [
      // Admin routes get red-themed toasts in bottom-left
      ...ToastDynamicSetup.getProviders(
        matToastConfig
          .setColorBgSuccess('#dc2626')
          .setColorBgError('#991b1b')
          .setPositionConfig(ToastPositionConfig.BottomLeft())
      )
    ]
  },
  {
    path: 'user',
    component: UserComponent,
    providers: [
      // User routes get blue-themed toasts in top-right
      ...ToastDynamicSetup.getProviders(
        matToastConfig
          .setColorBgSuccess('#2563eb')
          .setColorBgInfo('#1d4ed8')
          .setPositionConfig(ToastPositionConfig.TopRight())
      )
    ]
  }
];
```

### Advanced Configuration Examples

```typescript
// High-priority alerts with center positioning and long duration
const alertConfig = matToastConfig
  .setPositionConfig(ToastPositionConfig.Center())
  .setColorBgError('#b91c1c')
  .setColorBgWarn('#d97706');

@Component({
  providers: [...ToastDynamicSetup.getProviders(alertConfig)]
})
export class AlertComponent {
  showCriticalAlert() {
    this.toast.error('Critical system error!', 15000); // 15 second duration
  }
}

// Minimal toasts for dashboard widgets
const dashboardConfig = matToastConfig
  .setPositionConfig(ToastPositionConfig.Create(10, undefined, undefined, 10)) // Top-left corner
  .setShowIcon(false)
  .setDismissible(false);

@Component({
  providers: [...ToastDynamicSetup.getProviders(dashboardConfig)]
})
export class DashboardWidgetComponent {
  showQuickStatus() {
    this.toast.info('Data updated', 2000); // Quick, minimal notification
  }
}
```


### Key Benefits

- **✅ Isolated Configurations** - Each scope gets its own service instance
- **✅ No Global Impact** - Changes don't affect other parts of the application
- **✅ Easy to Use** - Same API as global configuration
- **✅ Flexible Scoping** - Works at component, route, module, or any provider level
- **✅ Type Safety** - Full TypeScript support with proper injection

> 💡 **Tip**: The `ToastDynamicSetup.getProviders()` method automatically includes both the configuration token and the `ToastService`.

## Troubleshooting

### Toasts Not Displaying or Styled Incorrectly

**Problem**: Toasts don't appear at all, have no styling, appear with broken layout, or display incorrectly.

**Root Cause**: This is almost always caused by missing Angular CDK overlay CSS. The toast library uses `@angular/cdk/overlay` for positioning and rendering, which requires its CSS to be loaded.

**Solution**: Import the required CDK overlay CSS file using one of these methods:

**Method 1 (Recommended): In `angular.json`**
```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@angular/cdk/overlay-prebuilt.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

**Method 2: In `styles.css`**
```css
@import '@angular/cdk/overlay-prebuilt.css';
```

**Method 3: In `index.html`**
```html
<link href="node_modules/@angular/cdk/overlay-prebuilt.css" rel="stylesheet">
```

> ⚠️ **Critical**: This CSS is mandatory even if you don't use Angular Material elsewhere in your project. The overlay functionality will not work without it.

### Missing Dependencies Error

**Problem**: Build errors about missing `@angular/cdk` modules or runtime errors about CDK overlay.

**Solution**: Install the Angular CDK and ensure it's properly configured:

```bash
npm install @angular/cdk
```

Then ensure you've imported the overlay CSS (see [installation steps](#installation)).

### TypeScript Errors

**Problem**: TypeScript compilation errors about toast types.

**Solution**: Ensure you're importing from the correct entry points:

```typescript
// ✅ Correct imports
import { ToastService, ToastData } from '@spider-baby/ui-toast';
import { ToastSetup, matToastConfig } from '@spider-baby/ui-toast/setup';

// ❌ Incorrect - don't import from internal paths
import { ToastService } from '@spider-baby/ui-toast/src/lib/services/toast.service';
```

### Performance Issues with Many Toasts

**Problem**: App becomes slow when showing many toasts simultaneously.

**Solution**: Use `clearAll()` to remove old toasts, or implement a maximum toast limit:

```typescript
// Clear old toasts before showing new ones
if (this.toast.getActiveCount() > 5) {
  this.toast.clearAll();
}
this.toast.success('New message');
```

### Animations Not Working

**Problem**: Toast animations appear choppy or don't work.

**Solution**: Ensure `@angular/animations` is properly configured:

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // Required for animations
    ToastSetup.getProviders(matToastConfig),
  ]
});
```

## Running unit tests

Run `nx test spider-baby-ui-toast` to execute the unit tests.
