export const DirectiveBasicCode = `@Directive({
  selector: '[sbProgImgLoader]',
})
export class ProgressiveImageLoaderDirective implements AfterContentInit, OnDestroy {

  // Inject the necessary services
  private _platformId = inject(PLATFORM_ID);
  private _el = inject(ElementRef);
  private _renderer = inject(Renderer2);

  // Fallback image URL to use if both small and large images fail
  fallbackUrl = input<string>(/* fallback image URL */);
  
  // Function to convert small image URL to large image URL
  smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>(undefined);
  
  // Large image URL to use after small image loads
  lrgUrl = input<string | null | undefined>('');
  
  // Configuration for retry attempts
  retryTimeoutMs = input<number>(3000);
  retryCount = input<number>(3);
  
  // Output event when image loading errors
  error = output<void>();
  
  // Private properties
  private _nativeElement: HTMLElement;
  private _cancelOnError?: () => void;
  private _cancelOnLoad?: () => void;
  
  constructor() {
    this._nativeElement = this._el.nativeElement;
  }

  // Implementation will follow...
}`
