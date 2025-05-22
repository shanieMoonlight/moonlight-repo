# @spider-baby/utils-imgs

A comprehensive Angular image utility library providing tools for progressive image loading and other image-related functionalities.

## Features

### Progressive Image Loading

The library provides a robust solution for implementing progressive image loading in Angular applications. This technique significantly improves user experience by:

- Loading a small placeholder image first for immediate visual feedback
- Seamlessly transitioning to high-quality images once loaded
- Providing fallback handling for failed image loads
- Supporting reactive updates to inputs using Angular signals
- Offering configurable retry mechanisms

### Key Components

#### ProgressiveImageLoaderDirective

A directive that can be applied to `<img>` elements to enable progressive image loading capabilities:

```typescript
<img 
  src="placeholder-image.jpg"
  sbProgImgLoader 
  [lrgUrl]="high-quality-image.jpg"
  [fallbackUrl]="fallback-image.jpg"
  [retryCount]="3"
  (error)="handleImageError()"
/>
```

#### ProgressiveImageComponent

A wrapper component for easier implementation with a cleaner API:

```typescript
<sb-progressive-image
  [placeholder]="placeholderUrl"
  [lrgUrl]="highQualityUrl"
  [fallbackUrl]="fallbackUrl"
  [objectFit]="'cover'"
  [transitionId]="pageTransitionId"
  (imgError)="handleError()"
></sb-progressive-image>
```

#### Utility Functions

The `ProgImgLoaderFunctions` class provides helper methods for common URL transformations:

- `replaceSegment`: Replace parts of a URL path
- `removeFromPath`: Remove segments from a URL path
- `replaceFilenameSuffix`: Replace filename suffixes (e.g., '-small.jpg' to '-large.jpg')
- `changeExtension`: Change file extensions (e.g., '.jpg' to '.webp')

## Installation

```bash
npm install @spider-baby/utils-imgs
```

## Usage

### Basic Usage

```typescript
import { ProgressiveImageComponent } from '@spider-baby/utils-imgs/progressive';

@Component({
  standalone: true,
  imports: [ProgressiveImageComponent],
  template: `
    <sb-progressive-image
      [placeholder]="'assets/images/small/image-small.jpg'"
      [lrgUrl]="'assets/images/large/image-large.jpg'"
      [objectFit]="'cover'"
    ></sb-progressive-image>
  `
})
export class MyComponent {}
```

### Using URL Transformation Functions

For dynamic URL transformations:

```typescript
import { ProgressiveImageComponent, ProgImgLoaderFunctions } from '@spider-baby/utils-imgs/progressive';

@Component({
  standalone: true,
  imports: [ProgressiveImageComponent],
  template: `
    <sb-progressive-image
      [placeholder]="'assets/images/small/image-small.jpg'"
      [smlToLrgFn]="smallToLargeUrlFn"
    ></sb-progressive-image>
  `
})
export class MyComponent {
  smallToLargeUrlFn = ProgImgLoaderFunctions.replaceSegment('/small/', '/large/');
}
```

### With View Transitions API

For smooth transitions between routes:

```typescript
import { ProgressiveImageComponent } from '@spider-baby/utils-imgs/progressive';

@Component({
  standalone: true,
  imports: [ProgressiveImageComponent],
  template: `
    <sb-progressive-image
      [placeholder]="'assets/images/small/image-small.jpg'"
      [lrgUrl]="'assets/images/large/image-large.jpg'"
      [transitionId]="'hero-image-' + itemId"
    ></sb-progressive-image>
  `
})
export class MyComponent {
  @Input() itemId!: string;
}
```

## API Reference

### ProgressiveImageLoaderDirective

| Input           | Type                                 | Default               | Description                                              |
|-----------------|--------------------------------------|----------------------|----------------------------------------------------------|
| fallbackUrl     | string                               | Built-in SVG          | URL to use if both placeholder and main image fail       |
| smlToLrgFn      | (smlImgUrl: string) => string        | undefined            | Function to convert small image URL to large image URL   |
| lrgUrl          | string                               | undefined            | URL for the high-quality image                           |
| retryTimeoutMs  | number                               | 3000                 | Timeout in ms before retrying failed image loads         |
| retryCount      | number                               | 3                    | Maximum number of retry attempts                         |

| Output          | Type                                 | Description                                              |
|-----------------|--------------------------------------|----------------------------------------------------------|
| error           | void                                 | Emitted when all loading attempts fail                   |

### ProgressiveImageComponent

| Input           | Type                                 | Default               | Description                                              |
|-----------------|--------------------------------------|----------------------|----------------------------------------------------------|
| placeholder     | string (required)                    | -                    | URL for the placeholder image                            |
| alt             | string                               | 'Progressive Image'  | Alt text for the image                                   |
| fallbackUrl     | string                               | Built-in SVG          | URL to use if both placeholder and main image fail       |
| smlToLrgFn      | (smlImgUrl: string) => string        | undefined            | Function to convert small image URL to large image URL   |
| lrgUrl          | string                               | undefined            | URL for the high-quality image                           |
| retryTimeoutMs  | number                               | 3000                 | Timeout in ms before retrying failed image loads         |
| retryCount      | number                               | 3                    | Maximum number of retry attempts                         |
| objectFit       | 'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down' | 'cover' | CSS object-fit property for the image            |
| objectPosition  | string                               | undefined            | CSS object-position property for the image               |
| imgWidth        | string                               | undefined            | CSS width for the image                                  |
| imgHeight       | string                               | undefined            | CSS height for the image                                 |
| transitionId    | string                               | undefined            | ID for View Transitions API integration                  |

| Output          | Type                                 | Description                                              |
|-----------------|--------------------------------------|----------------------------------------------------------|
| imgError        | void                                 | Emitted when all loading attempts fail                   |

## Best Practices

- Use appropriately sized placeholder images (typically 10-20% of the full size)
- Consider using modern image formats like WebP or AVIF for better compression
- Apply lazy loading for images below the fold
- Use appropriate objectFit values for different contexts
- Include meaningful alt text for accessibility

## Running unit tests

Run `nx test spider-baby-utils-imgs` to execute the unit tests.

## License

MIT
