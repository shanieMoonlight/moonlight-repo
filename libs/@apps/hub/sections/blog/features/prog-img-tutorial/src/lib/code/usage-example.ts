export const UsageExampleCode = `// Component class
export class MyComponent {
  readonly placeholderImg = 'assets/images/small-placeholder.jpg';
  readonly largeImg = 'assets/images/large-image.jpg';
  
  // Or use a function to transform the URL
  readonly imgTransformFn = (smallUrl: string) => {
    return smallUrl.replace('/small/', '/large/');
  };
}

// Template usage
<sb-progressive-image
  [placeholder]="placeholderImg"
  [lrgUrl]="largeImg"  
  alt="My progressive image"
  objectFit="cover"
  [transitionId]="'unique-id-' + imageId">
</sb-progressive-image>

// Alternative with transform function
<sb-progressive-image
  [placeholder]="placeholderImg"
  [smlToLrgFn]="imgTransformFn"  
  alt="My progressive image">
</sb-progressive-image>`
