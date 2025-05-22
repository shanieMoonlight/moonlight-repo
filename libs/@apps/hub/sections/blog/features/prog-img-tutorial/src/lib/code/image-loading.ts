export const ImageLoadingCode = `
  private loadLargeImage(url: string, onerror: () => void, retries = 3) {
    // Try to determine the URL for the large image
    const largeUrl = this.getLargeUrl(url);

    if (!largeUrl) {
      onerror();
      return; // Exit the function early if no large URL can be determined
    }

    // Create a new JavaScript Image object that isn't yet in the DOM, just in memory
    this._largeImage = new Image();
    
    // Set the src to trigger loading
    this._largeImage.src = largeUrl;

    // If load succeeds, replace the src of the img element with the large image
    this._largeImage.onload = () => this.setImgSrc(largeUrl);
    
    // If load fails, go to error handler
    this._largeImage.onerror = () => this.onLargeImageError(url, onerror, retries);
  }


  private onLargeImageError(url: string, onerror: () => void, retries = 3) {
    // If we've exhausted all retries, call the error callback
    if (retries < 1) {
      onerror();
      return;
    }

    // Otherwise, wait and try again with one fewer retry
    setTimeout(() => {
      console.log('retrying img load: ', retries);
      this.loadLargeImage(url, onerror, retries - 1);
    }, this.retryTimeoutMs());
  }


  private loadFallback() {  
    // Set the fallback image URL and adjust styling
    this.setImgSrc(this.fallbackUrl());
    this._renderer.setStyle(this._nativeElement, 'object-fit', 'contain');

    // Emit the error event so parent components can react
    this.error.emit();
  }


  private getLargeUrl(url: string): string | null {
    const currentSmlToLrgFn = this.smlToLrgFn();

    // First try using the transformation function if provided
    if (currentSmlToLrgFn) {
      const derivedUrl = currentSmlToLrgFn(url);
      devConsole.log('derivedUrl img load: ', derivedUrl);
      if (derivedUrl)
        return derivedUrl;
    }

    // If no transformation function or it returned falsy, use the explicit lrgUrl
    const currentLrgUrl = this.lrgUrl();
    if (currentLrgUrl)
      return currentLrgUrl;

    // If both options fail, log a warning and return null
    devConsole.warn('[ProgressiveImageLoader] Large image URL could not be determined. ' +
      'Ensure \`smlToLrgFn\` returns a valid URL or \`lrgUrl\` is set.');
    return null;
  }
  
  
  // Helper methods to manipulate the source attribute
  private setImgSrc = (src: string) =>
    this._renderer.setAttribute(this._nativeElement, 'src', src);
    
  private getImgSrc = () =>
    this._nativeElement.getAttribute('src');
`
