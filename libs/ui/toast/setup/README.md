# @spider-baby/ui-toast/setup

Secondary entry point of `@spider-baby/ui-toast`. It can be used by importing from `@spider-baby/ui-toast/setup`.

## Setup Classes

- **`ToastSetup`** - Main setup utilities and provider factory
- **`ToastConfig`** - Configuration class with fluent API
- **`ToastPositionConfig`** - Positioning configuration
- **`ToastAnimationConfig`** - Animation timing configuration
- **`matToastConfig`** - Pre-configured Material Design 3 settings

## Prerequisites

Before using the setup, ensure you have:

1. Installed `@angular/cdk`
2. **Imported `@angular/cdk/overlay-prebuilt.css`** in your project
3. Configured animations with `provideAnimations()`

## Quick Setup

```typescript
import { ToastSetup, matToastConfig } from '@spider-baby/ui-toast/setup';

bootstrapApplication(AppComponent, {
  providers: [
    ToastSetup.getProviders(matToastConfig),
    // ... other providers
  ]
});
```

See the main README for complete installation instructions.
