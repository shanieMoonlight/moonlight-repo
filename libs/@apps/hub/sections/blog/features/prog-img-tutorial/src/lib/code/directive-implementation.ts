export const DirectiveImplementationCode = `
  ngAfterContentInit() {
    // Skip server-side rendering
    if (!isPlatformBrowser(this._platformId))
      return;

    this.registerEvents();
    this._afterContentInitRun = true;
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  private registerEvents() {
    // Clear existing listeners
    this.removeListeners();

    // Listen for error and load events on the image
    this._cancelOnError = this._renderer.listen(
      this._nativeElement, 
      'error', 
      this.onPlaceholderError.bind(this)
    );
    
    this._cancelOnLoad = this._renderer.listen(
      this._nativeElement, 
      'load', 
      this.onPlaceholderLoad.bind(this)
    );
  }

  private onPlaceholderError() {
    // Stop listening and try to load large image
    this.removeListeners();
    const src = this._nativeElement.getAttribute('src');
    this.loadLargeImage(src ?? '#', this.loadFallback.bind(this), this.retryCount());
  }

  private onPlaceholderLoad() {
    // Stop listening and try to load large image
    this.removeListeners();
    const src = this._nativeElement.getAttribute('src');
    this.loadLargeImage(src ?? '#', () => console.log('Using placeholder'), this.retryCount());
  }
`
