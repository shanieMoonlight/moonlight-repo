export const DirectiveImplementationCode = `
  ngAfterContentInit() {
    // Skip server-side rendering
    if (!isPlatformBrowser(this._platformId))
      return;

    this.registerEvents();
    this._afterContentInitRun = true;
  }

  ngOnDestroy() {
    //tidy up
    this.removeListeners();
  }

  private registerEvents() {
       //Clear any existing listeners
    this.removeListeners()

    //Success or failure: try to load the large image anyway
    this._cancelOnError = this._renderer.listen(
      this._nativeElement,
      'error',
      () => this.onPlaceholderError()  //attempt to load large image and use fallback if that fails
    )

    this._cancelOnLoad = this._renderer.listen(
      this._nativeElement,
      'load',
      () => this.onPlaceholderLoad() //attempt to load large image and use placeholder if that fails
    )
  }

  private onPlaceholderError() {
    // Stop listening and try to load large image
    this.removeListeners()

    const src = this._nativeElement.getAttribute('src')
    
    this.loadLargeImage(
      src ?? '#', 
      () => this.loadFallback(), //On error: use fallback image since the placeholder failed
      this.retryCount()
    );;
  }

  private onPlaceholderLoad() {
    // Stop listening and try to load large image
    this.removeListeners();

    const src = this._nativeElement.getAttribute('src');
    
    this.loadLargeImage(
      src ?? '#', 
      () => console.log('Using placeholder'),  //On error: do nothing and use what's already there
      this.retryCount());
  }
`
