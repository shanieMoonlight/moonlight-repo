export const DirectiveBasicCode = `@Directive({
  selector: '[sbProgImgLoader]',
})
export class ProgressiveImageLoaderDirective implements AfterContentInit, OnDestroy {

  // Dependency injection for required services
  private _platformId = inject(PLATFORM_ID);
  private _el = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private _destroyor = inject(DestroyRef);

  // Inputs with default values and transforms
  /** 
   * What to use when placeholder and main img load fail.
   * Default = generic image icon SVG
   */
  fallbackUrl = input(fallBackSvgDataUri, {
    transform: (value: string | undefined) => value ?? fallBackSvgDataUri,
  });

  /**
   * Function to convert the inital small image url to the large image url.
   * Default = undefined
   * This is the first thing to try. If it's falsey 'lrgUrl' will be tried instead 
   */
  smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>(undefined);
  // For reactive updates
  private _smlToLrgFn$ = toObservable(this.smlToLrgFn);

  /**
   * The url to use after the inital small image url is loaded.
   * Will only be used if 'smlToLrgFn' is not provided or returns a falsy value.
   * Default = undefined
   */
  lrgUrl = input<string | null | undefined>('');
  // For reactive updates
  private _lrgUrl$ = toObservable(this.lrgUrl);

  /** 
   * How long to wait before trying again on load failure (milliseconds)
   * Default = 3000ms
   */
  retryTimeoutMs = input<number>(3000);

  /**
   * Max attempts at largUrl load
   * Default = 3
   */
  retryCount = input<number>(3);

  // Output event when any loading error occurs
  error = output<void>();

  // The actual image element
  private _nativeElement: HTMLImageElement = this._el.nativeElement;
  
  // Event unlisten functions to clean up listeners and prevent memory leaks
  private _cancelOnError?: () => void;
  private _cancelOnLoad?: () => void;
  private _largeImage?: HTMLImageElement;

  // Implementation will follow...
}`
