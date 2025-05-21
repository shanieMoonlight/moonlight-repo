
export const BasicUsageExample = `<sb-progressive-image
  [placeholder]="'assets/images/small-thumbnail.jpg'"
  [lrgUrl]="'assets/images/full-size-image.jpg'"
  alt="Product image"
></sb-progressive-image>`;

export const TransformFunctionExample = `// In your component
transformToHighRes(smallUrl: string): string {
  return smallUrl.replace('/thumbnails/', '/highres/');
}

// In your template
<sb-progressive-image
  [placeholder]="'assets/images/thumbnails/product-123.jpg'"
  [smlToLrgFn]="transformToHighRes"
  alt="Product image"
></sb-progressive-image>`;

export const ViewTransitionsExample = `<sb-progressive-image
  [placeholder]="product.thumbnailUrl"
  [lrgUrl]="product.fullImageUrl"
  [transitionId]="'product-' + product.id"
  alt="{{product.name}}"
></sb-progressive-image>`;

export const FallbackImageExample = `<sb-progressive-image
  [placeholder]="product.thumbnailUrl"
  [lrgUrl]="product.fullImageUrl"
  [fallbackUrl]="'assets/images/product-not-found.jpg'"
  alt="{{product.name}}"
></sb-progressive-image>`;

export const ObjectFitExample = `<!-- Fill container while maintaining aspect ratio, cropping if needed -->
<sb-progressive-image
  [placeholder]="thumbnailUrl"
  [lrgUrl]="largeImageUrl"
  objectFit="cover"
  alt="Cover image"
></sb-progressive-image>

<!-- Display entire image within container, potentially leaving empty space -->
<sb-progressive-image
  [placeholder]="thumbnailUrl"
  [lrgUrl]="largeImageUrl"
  objectFit="contain"
  alt="Contained image"
></sb-progressive-image>`;

export const PredefinedFunctionsExample = `// In your component
import { ProgImgLoaderFunctions } from '@your-lib/progressive';

@Component({
  // ...
})
export class GalleryComponent {
  // Replace '-small.jpg' suffix with '-large.jpg'
  readonly suffixTransformer = ProgImgLoaderFunctions.replaceFilenameSuffix(
    '-small', 
    '-large'
  );
  
  // Replace a path segment
  readonly pathTransformer = ProgImgLoaderFunctions.replaceSegment(
    '/thumbnails/', 
    '/fullsize/'
  );
}`;

export const PredefinedFunctionsTemplateExample = `<sb-progressive-image
  [placeholder]="'assets/images/thumbnails/photo-small.jpg'"
  [smlToLrgFn]="suffixTransformer"
  alt="Gallery image"
></sb-progressive-image>`;
