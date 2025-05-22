export const DirectiveImplementationCode = `
  ngAfterContentInit() {
    // Skip server-side rendering
    if (!isPlatformBrowser(this._platformId))
      return;

    this.registerEvents();

    // Listen for changes to inputs in case the user changes them after initialization
    // Using combineLatest with takeUntilDestroyed for automatic cleanup on component destruction
    combineLatest([this._lrgUrl$, this._smlToLrgFn$])
      .pipe(takeUntilDestroyed(this._destroyor))
      .subscribe(() => {
          this.registerEvents()
      });
  }

  ngOnDestroy() {
    // Clean up all event listeners
    this.removeListeners();
  }

  private registerEvents() {
    // Clear any existing listeners first to avoid duplicates
    this.removeListeners();

    // Register error event for the placeholder image
    this._cancelOnError = this._renderer.listen(
      this._nativeElement,
      'error',
      () => this.onPlaceholderError()  // Attempt to load large image and use fallback if that fails
    );

    // Register load event for the placeholder image
    this._cancelOnLoad = this._renderer.listen(
      this._nativeElement,
      'load',
      () => this.onPlaceholderLoad()  // Attempt to load large image and use placeholder if that fails
    );
  }

  private onPlaceholderError() {
    // Stop listening since we're now handling the next phase
    this.removeListeners();

    const src = this.getImgSrc();
    this.loadLargeImage(
      src ?? '#', 
      () => this.loadFallback(), // On error: use fallback image since the placeholder failed
      this.retryCount()
    );
  }

  private onPlaceholderLoad() {
    // Stop listening since we're now handling the next phase
    this.removeListeners();

    const src = this.getImgSrc();
    this.loadLargeImage(
      src ?? '#', 
      () => devConsole.log('Using placeholder'),  // On error: stay with the placeholder
      this.retryCount()
    );
  }
  
  // Helper methods to remove event listeners
  private removeListeners() {
    this.removeErrorEvent();
    this.removeOnLoadEvent();
  }

  private removeErrorEvent = () => 
    this._cancelOnError?.();

  private removeOnLoadEvent = () =>
    this._cancelOnLoad?.();
`
