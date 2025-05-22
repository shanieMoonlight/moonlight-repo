import { isPlatformBrowser } from '@angular/common';
import { devConsole } from '@spider-baby/dev-console';
import { AfterContentInit, Directive, ElementRef, inject, OnDestroy, PLATFORM_ID, Renderer2, input, output, effect, DestroyRef, Input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';

//##########################################################//

const fallBackSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>`
const fallBackSvgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fallBackSvg)}`;

//##########################################################//


@Directive({
  selector: '[sbProgImgLoader]',
})
export class ProgressiveImageLoaderDirective implements AfterContentInit, OnDestroy {

  private _platformId = inject(PLATFORM_ID);
  private _el = inject(ElementRef);
  private _renderer = inject(Renderer2)

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - //

  fallbackUrl = input(fallBackSvgDataUri, {
    transform: (value) => value ?? fallBackSvgDataUri,
  });

  private _smlToLrgFn?: ((smlImgUrl: string) => string) | undefined;
  /**
   * Function to convert the inital small image url to the large image url.
   * Default = undefined
   * This is the first thing to try. If it's falsey 'lrgUrl' will be tried instead 
   */
  // smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>(undefined);
  @Input({ alias: 'smlToLrgFn' })
  set smlToLrgFnSetter(value: ((smlImgUrl: string) => string) | undefined) {
    this._smlToLrgFn = value;
    this.registerEvents();
  }

  private _lrgUrl: string | null | undefined = '';
  /**
   * The url to use after the  inital small image url is loaded.
   * Will only be used if 'smlToLrgFn' is not provided or returns a falsy value.
   * Default = undefined
   */
  // lrgUrl = input<string | null | undefined>('');
  @Input({ alias: 'lrgUrl' })
  set lrgUrlSetter(value: string | null | undefined) {
    this._lrgUrl = value;
    this.registerEvents();
  }


  retryTimeoutMs = input<number>(3000);
  retryCount = input<number>(3);

  //- - - - - - - - - - - - - - - //

  // eslint-disable-next-line @angular-eslint/no-output-native
  error = output<void>();

  //- - - - - - - - - - - - - - - //

  private _nativeElement: HTMLElement = this._el.nativeElement;
  private _cancelOnError?: () => void;
  private _cancelOnLoad?: () => void;
  private _largeImage?: HTMLImageElement

  //------------------------------//

  //In case the image is loaded after the inputs are set
  ngAfterContentInit() {
    this.registerEvents()
  }

  //------------------------------//

  ngOnDestroy() {
    this.removeListeners()
  }

  //------------------------------// 

  private registerEvents() {

    // Skip server-side rendering
    if (!isPlatformBrowser(this._platformId))
      return


    //Clear any existing listeners
    this.removeListeners()

    //Success or failure try to load the large image anyway
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

  //------------------------------//

  /**
   * Load large imasge and use fallback if that fails
   */
  private onPlaceholderError() {

    //stop listening
    this.removeListeners()
    const src = this._nativeElement.getAttribute('src')
    this.loadLargeImage(
      src ?? '#',
      () => this.loadFallback(),
      this.retryCount()
    );

  }

  //------------------------------// 

  /**
   * Load large image and if it fails stay with the placeholder
   */
  private onPlaceholderLoad() {

    //stop listening
    this.removeListeners()
    const src = this._nativeElement.getAttribute('src')
    this.loadLargeImage(src ?? '#', () => console.log('Using placeholder'), this.retryCount())

  }

  //------------------------------// 

  private loadLargeImage(url: string, onerror: () => void, retries = 3) {

    const largeUrl = this.getLargeUrl(url)

    if (!largeUrl) {
      onerror();
      return; // Exit the function early
    }

    this._largeImage = new Image()
    this._largeImage.src = largeUrl
    this._largeImage.onload = () => this.renderLargeImage(largeUrl)
    this._largeImage.onerror = () => this.onLargeImageError(url, onerror, retries)

  }

  //------------------------------//

  /**
   * Retry and then use oerror if retries all fail 
   */
  private onLargeImageError(url: string, onerror: () => void, retries = 3) {

    if (retries < 1) {
      onerror()
      return
    }

    setTimeout(() => {
      console.log('retrying img load: ', retries)
      this.loadLargeImage(url, onerror, retries - 1)
    }, this.retryTimeoutMs())

  }

  //------------------------------// 

  private loadFallback() {


    this._renderer.setAttribute(this._nativeElement, 'src', this.fallbackUrl() as string)
    this._renderer.setStyle(this._nativeElement, 'object-fit', 'contain');
    this.error.emit()

  }

  //------------------------------//  

  private renderLargeImage = (largeUrl: string) =>
    this._renderer.setAttribute(this._nativeElement, 'src', largeUrl)

  //------------------------------// 

  private removeListeners() {

    this.removeErrorEvent()
    this.removeOnLoadEvent()

  }

  //------------------------------// 

  private removeErrorEvent = () =>
    this._cancelOnError?.()

  private removeOnLoadEvent = () =>
    this._cancelOnLoad?.()

  //------------------------------// 

  private getLargeUrl(url: string): string | null {

    const currentSmlToLrgFn = this._smlToLrgFn

    if (currentSmlToLrgFn) {
      const derivedUrl = currentSmlToLrgFn(url);
      devConsole.log('derivedUrl img load: ', derivedUrl)
      if (derivedUrl) return derivedUrl; // Ensure the function returns a truthy value
    }

    const currentLrgUrl = this._lrgUrl;
    if (currentLrgUrl) // Checks for truthiness (non-empty string)
      return currentLrgUrl;

    // If neither a function nor a direct URL is provided, or they return falsy values,
    // we cannot determine the large image URL.
    devConsole.warn('[ProgressiveImageLoader] Large image URL could not be determined. Ensure `smlToLrgFn` returns a valid URL or `lrgUrl` is set.');
    return null;

  }

  //------------------------------// 

}//Cls
