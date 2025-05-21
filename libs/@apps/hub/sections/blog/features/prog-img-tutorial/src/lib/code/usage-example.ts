export const UsageExampleCode = `// Basic usage with direct URLs
<sb-progressive-image
  [placeholder]="'assets/images/small-placeholder.jpg'"
  [lrgUrl]="'assets/images/large-image.jpg'"  
  alt="My progressive image">
</sb-progressive-image>

// With URL transformation function
<sb-progressive-image
  [placeholder]="'assets/images/thumbnails/product-123.jpg'"
  [smlToLrgFn]="(url) => url.replace('/thumbnails/', '/highres/')"  
  alt="Product image">
</sb-progressive-image>

// With view transitions API support
<sb-progressive-image
  [placeholder]="product.thumbnailUrl"
  [lrgUrl]="product.fullImageUrl"
  [transitionId]="'product-' + product.id"
  objectFit="cover"
  alt="{{product.name}}">
</sb-progressive-image>

// With fallback image and specific object-fit
<sb-progressive-image
  [placeholder]="product.thumbnailUrl"
  [lrgUrl]="product.fullImageUrl"
  [fallbackUrl]="'assets/images/product-not-found.jpg'">
</sb-progressive-image>`