# Toast Positioning Examples

The enhanced toast library now supports independent vertical and horizontal positioning, giving you a 3x3 grid of possible positions.

## Basic Usage

### Using ToastService convenience methods:

```typescript
// Inject the service
constructor(private toastService: ToastService) {}

// Position-specific methods
this.toastService.showTopLeft('Top left message', 'success');
this.toastService.showTopRight('Top right message', 'info'); 
this.toastService.showTopCenter('Top center message', 'warn');

this.toastService.showBottomLeft('Bottom left message', 'error');
this.toastService.showBottomRight('Bottom right message', 'success');
this.toastService.showBottomCenter('Bottom center message', 'info');

this.toastService.showCenter('Critical center message', 'error');
```

### Using ToastData factory methods:

```typescript
// Create positioned toast data
const topLeftToast = ToastData.TopLeft('success', 'Operation completed!');
const centerToast = ToastData.Center('error', 'Critical error occurred!');
const bottomRightToast = ToastData.BottomRight('info', 'New notification');

// Show them
this.toastService.show(topLeftToast, 5000);
this.toastService.show(centerToast, 8000);
this.toastService.show(bottomRightToast, 4000);
```

### Using ToastOptions directly:

```typescript
const customToast = new ToastData('warn', 'Custom positioned toast', {
  positionVertical: 'bottom',
  positionHorizontal: 'left',
  duration: 6000,
  dismissible: true,
  showIcon: true
});

this.toastService.show(customToast);
```

## Positioning Grid

```
┌─────────────┬─────────────┬─────────────┐
│  top-left   │ top-center  │ top-right   │
├─────────────┼─────────────┼─────────────┤
│center-left  │   center    │center-right │
├─────────────┼─────────────┼─────────────┤
│bottom-left  │bottom-center│bottom-right │
└─────────────┴─────────────┴─────────────┘
```

## Stacking Behavior

- **Same position toasts**: Stack vertically with proper spacing
- **Center-center toasts**: Overlay each other (use sparingly for critical messages)
- **Different positions**: Don't interfere with each other

## Configuration

Adjust positioning margins in your toast configuration:

```typescript
const config = ToastPositionConfig.Create(
  20,  // topPx
  20,  // rightPx  
  20,  // bottomPx
  20   // leftPx
);
```

## Backward Compatibility

The old `position` property is still supported:

```typescript
// This still works
const oldStyleToast = new ToastData('info', 'Old style', {
  position: 'top'  // Maps to top-right (default horizontal)
});
```
