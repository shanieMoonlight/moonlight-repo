export const ImageLoadingCode = `
  private loadLargeImage(url: string, onerror: () => void, retries = 3) {

    //Try to get the url for the large image
    const largeUrl = this.getLargeUrl(url);

    if (!largeUrl) {
      onerror();
      return; // Exit early if no large URL
    }

    this._largeImage = new Image();
    this._largeImage.src = largeUrl;
    this._largeImage.onload = () => this.renderLargeImage(largeUrl);
    this._largeImage.onerror = () => this.onLargeImageError(url, onerror, retries);
  }


  private onLargeImageError(url: string, onerror: () => void, retries = 3) {
    if (retries < 1) {
      onerror();
      return;
    }

    setTimeout(() => {
      console.log('retrying img load: ', retries);
      this.loadLargeImage(url, onerror, retries - 1);
    }, this.retryTimeoutMs());
  }


  private loadFallback() {  
    this._renderer.setAttribute(this._nativeElement, 'src', this.fallbackUrl() as string);
    this._renderer.setStyle(this._nativeElement, 'object-fit', 'contain');

    this.error.emit();
  }
 

  private renderLargeImage = (largeUrl: string) => 
    this._renderer.setAttribute(this._nativeElement, 'src', largeUrl);


  private getLargeUrl(url: string): string | null {
    const currentSmlToLrgFn = this.smlToLrgFn();

    if (currentSmlToLrgFn) {
      const derivedUrl = currentSmlToLrgFn(url);
      if (derivedUrl) 
        return derivedUrl;
    }

    const currentLrgUrl = this.lrgUrl();
    if (currentLrgUrl)
      return currentLrgUrl;

    return null;
  }
`
