# Toast Library Enhancement Guide

This guide shows how to implement **Position Animations** and **Custom Icon Support** in the `spider-baby-ui-toast` library.

## 🎭 Position Animations

### 1. Core Concept
Position animations allow toasts to smoothly transition between different screen positions (e.g., moving from top-right to bottom-left with animation).

### 2. Implementation Steps

#### Step 1: Enhance Animation Types
```typescript
// Add to toast-animations.ts
export type ToastAnimationType = 
  | 'fade' | 'slide' | 'scale' | 'bounce'
  | 'position-slide' | 'position-fade' | 'position-arc';  // New types
```

#### Step 2: Add Position Animation Triggers
```typescript
// Enhanced animation trigger in toast-animations.ts
export const enhancedToastAnimation = trigger('enhancedToastAnimation', [
  // Existing animations...
  
  // Position slide - smooth movement between positions
  transition('* => position-slide', [
    animate('{{ positionMs }}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
      style({ transform: 'translate({{ deltaX }}px, {{ deltaY }}px)' })
    )
  ], { params: { positionMs: 500, deltaX: 0, deltaY: 0 } }),
  
  // Position fade - fade out/in at new position  
  transition('* => position-fade', [
    group([
      animate('{{ fadeOutMs }}ms', style({ opacity: 0 })),
      animate('{{ fadeInMs }}ms', style({ 
        opacity: 1, 
        transform: 'translate({{ deltaX }}px, {{ deltaY }}px)' 
      }))
    ])
  ], { params: { fadeOutMs: 200, fadeInMs: 300, deltaX: 0, deltaY: 0 } }),
  
  // Position arc - curved movement with keyframes
  transition('* => position-arc', [
    animate('{{ arcMs }}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
      keyframes([
        style({ transform: 'translate(0, 0)', offset: 0 }),
        style({ transform: 'translate({{ midX }}px, {{ midY }}px)', offset: 0.5 }),
        style({ transform: 'translate({{ deltaX }}px, {{ deltaY }}px)', offset: 1 })
      ])
    )
  ], { params: { arcMs: 600, deltaX: 0, deltaY: 0, midX: 0, midY: 0 } })
]);
```

#### Step 3: Enhance ToastRef with Position Methods
```typescript
// Add to toast-ref.ts
export class ToastRef {
  // Existing methods...
  
  /**
   * Animates toast to a new position
   */
  animateToPosition(
    newPosition: { vertical: 'top' | 'bottom' | 'center', horizontal: 'left' | 'right' | 'center' },
    animationType: 'position-slide' | 'position-fade' | 'position-arc' = 'position-slide',
    duration = 500
  ): Promise<void> {
    
    return new Promise((resolve) => {
      // Calculate position delta
      const delta = this.calculatePositionDelta(newPosition);
      
      // Trigger animation with calculated parameters
      this.triggerAnimation(animationType, { ...delta, duration });
      
      // Update overlay position after animation
      setTimeout(() => {
        this.updateOverlayPosition(newPosition);
        resolve();
      }, duration);
    });
  }
  
  private calculatePositionDelta(newPosition: any) {
    // Implementation to calculate movement distance
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    // Calculate deltaX, deltaY, midX, midY based on current vs new position
    return { deltaX: 0, deltaY: 0, midX: 0, midY: 0 };
  }
}
```

#### Step 4: Service Integration
```typescript
// Add to toast.service.ts
export class ToastService {
  // Existing methods...
  
  /**
   * Move all active toasts to a new position with animation
   */
  animateAllToPosition(
    newPosition: { vertical: 'top' | 'bottom' | 'center', horizontal: 'left' | 'right' | 'center' },
    animationType: 'position-slide' | 'position-fade' | 'position-arc' = 'position-slide'
  ): Promise<void[]> {
    
    const animations = Array.from(this.activeToasts).map(toast => 
      toast.animateToPosition(newPosition, animationType)
    );
    
    return Promise.all(animations);
  }
  
  /**
   * Create a toast that automatically moves between positions
   */
  showWithPositionSequence(
    data: ToastData,
    positions: Array<{ vertical: 'top' | 'bottom' | 'center', horizontal: 'left' | 'right' | 'center' }>,
    duration = 2000
  ): ToastRef {
    
    const toastRef = this.show(data);
    
    let currentIndex = 0;
    const animateNext = () => {
      if (currentIndex < positions.length - 1) {
        currentIndex++;
        toastRef.animateToPosition(positions[currentIndex])
          .then(() => {
            setTimeout(animateNext, duration);
          });
      }
    };
    
    setTimeout(animateNext, duration);
    return toastRef;
  }
}
```

### 3. Usage Examples
```typescript
// Move toast to new position
const toast = toastService.success('Hello!');
toast.animateToPosition(
  { vertical: 'bottom', horizontal: 'left' }, 
  'position-arc',
  800
);

// Create animated sequence
toastService.showWithPositionSequence(
  ToastData.Info('Moving toast!'),
  [
    { vertical: 'top', horizontal: 'right' },
    { vertical: 'center', horizontal: 'center' },
    { vertical: 'bottom', horizontal: 'left' }
  ]
);
```

---

## 🎨 Custom Icon Support

### 1. Core Concept
Allow users to provide custom icons (SVG, font icons, images, components) instead of the built-in Material Design icons.

### 2. Implementation Steps

#### Step 1: Define Icon Types and Interfaces
```typescript
// Add to new file: toast-icons.ts
export type IconType = 'svg' | 'font' | 'component' | 'template' | 'url';

export interface CustomIcon {
  type: IconType;
  content: string | TemplateRef<any> | Type<any>;
  className?: string;
  style?: { [key: string]: string };
  size?: 'sm' | 'md' | 'lg' | number;
}

export interface IconConfig {
  warn?: CustomIcon;
  error?: CustomIcon; 
  success?: CustomIcon;
  info?: CustomIcon;
  global?: CustomIcon;  // Override all types
  library?: 'material' | 'fontawesome' | 'heroicons';
}
```

#### Step 2: Enhance ToastOptions and ToastData
```typescript
// Modify toast-data.ts
export interface ToastOptions {
  // Existing options...
  customIcon?: CustomIcon;
  iconConfig?: IconConfig;
}

export class ToastData {
  // Existing properties...
  public customIcon?: CustomIcon;
  public iconConfig?: IconConfig;
  
  // Fluent API methods
  withSvgIcon(svgContent: string): ToastData {
    this.customIcon = { type: 'svg', content: svgContent };
    return this;
  }
  
  withFontIcon(iconClass: string, library: 'fontawesome' | 'material' = 'material'): ToastData {
    this.customIcon = { 
      type: 'font', 
      content: iconClass,
      className: library === 'fontawesome' ? 'fas' : 'material-icons'
    };
    return this;
  }
  
  withImageIcon(url: string): ToastData {
    this.customIcon = { type: 'url', content: url };
    return this;
  }
  
  withComponentIcon(component: Type<any>): ToastData {
    this.customIcon = { type: 'component', content: component };
    return this;
  }
}
```

#### Step 3: Update Component Template
```html
<!-- Modify toast.component.html -->
@if (_showIcon()) {
<div id="icon" [style.color]="_txtColor()" aria-label="Toast icon">
  
  <!-- Custom icon rendering -->
  @if (_hasCustomIcon()) {
    <ng-container [ngSwitch]="_customIcon()?.type">
      
      <!-- SVG Icon -->
      @case ('svg') {
        <div class="custom-icon svg-icon" 
             [innerHTML]="_customIcon()?.content"
             [class]="_customIcon()?.className">
        </div>
      }
      
      <!-- Font Icon -->
      @case ('font') {
        <i class="custom-icon font-icon"
           [class]="_customIcon()?.className + ' ' + _customIcon()?.content"
           [ngStyle]="_customIcon()?.style">
        </i>
      }
      
      <!-- Image Icon -->
      @case ('url') {
        <img class="custom-icon image-icon"
             [src]="_customIcon()?.content"
             [class]="_customIcon()?.className"
             [ngStyle]="_customIcon()?.style"
             alt="Toast icon">
      }
      
      <!-- Component Icon -->
      @case ('component') {
        <ng-container *ngComponentOutlet="_customIcon()?.content"></ng-container>
      }
      
      <!-- Template Icon -->
      @case ('template') {
        <ng-container [ngTemplateOutlet]="_customIcon()?.content"></ng-container>
      }
      
    </ng-container>
  }
  @else {
    <!-- Default built-in icons -->
    <ng-container [ngTemplateOutlet]="iconTemplate" [ngTemplateOutletContext]="{ toastType: _toastType() }" />
  }
  
</div>
}
```

#### Step 4: Update Component Logic
```typescript
// Modify toast.component.ts
export class SbToastComponent {
  // Existing properties...
  
  _hasCustomIcon = computed(() => !!this._data().customIcon);
  _customIcon = computed(() => this._data().customIcon);
  
  // Enhanced icon resolution
  _resolveIcon(): CustomIcon | null {
    const data = this._data();
    
    // Priority: custom icon > type-specific > global > built-in
    if (data.customIcon) return data.customIcon;
    if (data.iconConfig?.global) return data.iconConfig.global;
    if (data.iconConfig?.[data.type]) return data.iconConfig[data.type];
    
    return null;
  }
}
```

#### Step 5: Global Icon Configuration
```typescript
// Add to toast-config.ts
export interface ToastConfig {
  // Existing config...
  defaultIconConfig?: IconConfig;
}

// Setup with global icons
export function provideToastWithIcons(config: Partial<ToastConfig> = {}): Provider[] {
  return [
    provideToast(config),
    {
      provide: TOAST_ICON_CONFIG,
      useValue: config.defaultIconConfig || {}
    }
  ];
}
```

### 3. Usage Examples
```typescript
// SVG icon
toastService.success('Custom success!')
  .withSvgIcon('<svg>...</svg>');

// Font Awesome
toastService.error('Font Awesome error!')
  .withFontIcon('fa-exclamation-triangle', 'fontawesome');

// Image icon
toastService.info('Image icon!')
  .withImageIcon('/assets/icons/info.png');

// Global configuration
provideToastWithIcons({
  defaultIconConfig: {
    success: { type: 'font', content: 'fa-check', className: 'fas text-success' },
    error: { type: 'font', content: 'fa-times', className: 'fas text-danger' },
    warn: { type: 'font', content: 'fa-warning', className: 'fas text-warning' },
    info: { type: 'font', content: 'fa-info', className: 'fas text-info' }
  }
});
```

---

## 🚀 Migration Strategy

### Phase 1: Core Infrastructure
1. Add new interfaces and types
2. Enhance existing classes with optional properties
3. Maintain backward compatibility

### Phase 2: Animation System
1. Extend animation triggers
2. Add position calculation utilities
3. Implement ToastRef position methods

### Phase 3: Icon System
1. Add icon rendering logic
2. Update component template
3. Implement global configuration

### Phase 4: Testing & Documentation
1. Add comprehensive tests for new features
2. Update documentation with examples
3. Create migration guide for existing users

## 📦 Version Strategy
- **v1.1.0**: Add custom icon support (non-breaking)
- **v1.2.0**: Add position animations (non-breaking)
- **v2.0.0**: Major refactor if needed (breaking changes)

Both features can be implemented incrementally without breaking existing functionality!
