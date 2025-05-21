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
       //Clear any existing listeners
    this.removeListeners()

    //Success of failure try to load the large image anyway
    this._cancelOnError = this._renderer.listen(
      this._nativeElement,
      'error',
      () => this.onPlaceholderError()
    )

    this._cancelOnLoad = this._renderer.listen(
      this._nativeElement,
      'load',
      () => this.onPlaceholderLoad()
    )
  }

  private onPlaceholderError() {
    // Stop listening and try to load large image
    this.removeListeners()

    const src = this._nativeElement.getAttribute('src')
    
    this.loadLargeImage(
      src ?? '#', 
      () => this.loadFallback(), 
      this.retryCount()
    );;
  }

  private onPlaceholderLoad() {
    // Stop listening and try to load large image
    this.removeListeners();
    const src = this._nativeElement.getAttribute('src');
    this.loadLargeImage(src ?? '#', () => console.log('Using placeholder'), this.retryCount());
  }
`
