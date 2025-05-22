/* eslint-disable @angular-eslint/no-output-native */
import { isPlatformBrowser } from '@angular/common';
import { AfterContentInit, DestroyRef, Directive, ElementRef, inject, input, OnDestroy, output, PLATFORM_ID, Renderer2 } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { devConsole } from '@spider-baby/dev-console';
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
  private _destroyor = inject(DestroyRef)

  //- - - - - - - - - - - - - - - //

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
  //This is so we can react to  changes to smlToLrgFn in ngAfterContentInit
  private _smlToLrgFn$ = toObservable(this.smlToLrgFn);

  /**
   * The url to use after the  inital small image url is loaded.
   * Will only be used if 'smlToLrgFn' is not provided or returns a falsy value.
   * Default = undefined
   */
  lrgUrl = input<string | null | undefined>('');
  //This is so we can react to  changes to lrgUrl in ngAfterContentInit
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

  //- - - - - - - - - - - - - - - //

  /** Any load error */
  error = output<void>();

  //- - - - - - - - - - - - - - - //

  private _nativeElement: HTMLImageElement = this._el.nativeElement;
  private _cancelOnError?: () => void;
  private _cancelOnLoad?: () => void;
  private _largeImage?: HTMLImageElement;

  //------------------------------//

  ngAfterContentInit() {

    //Skip SSR
    if (!isPlatformBrowser(this._platformId))
      return


    this.registerEvents()


    // Listen for changes to inputs in case the user changes them after init
    combineLatest([this._lrgUrl$, this._smlToLrgFn$])
      .pipe(takeUntilDestroyed(this._destroyor))
      .subscribe(() => {
          this.registerEvents()
      })

  }

  //------------------------------//

  ngOnDestroy() {
    this.removeListeners()
  }

  //------------------------------// 

  private registerEvents() {

    //Clear any existing listeners
    this.removeListeners()

    //Success or failure: try to load the large image anyway
    this._cancelOnError = this._renderer.listen(
      this._nativeElement,
      'error',
      () => this.onPlaceholderError() //attempt to load large image and use placeholder if that fails
    )

    this._cancelOnLoad = this._renderer.listen(
      this._nativeElement,
      'load',
      () => this.onPlaceholderLoad() //attempt to load large image and use fallbackImg if that fails
    )

  }

  //------------------------------//

  /**
   * Load large image and use fallback if that fails
   */
  private onPlaceholderError() {

    //stop listening
    this.removeListeners()

    const src = this.getImgSrc()
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

    const src = this.getImgSrc()
    this.loadLargeImage(src ?? '#', () => devConsole.log('Using placeholder'), this.retryCount())

  }

  //------------------------------// 

  private loadLargeImage(url: string, onerror: () => void, retries = 3) {

    const largeUrl = this.getLargeUrl(url)

    if (!largeUrl) {
      onerror();
      return; // Exit the function early
    }

    //This create a new JavaScript Image object that isn't yet in the DOM, just in memory
    this._largeImage = new Image()

    //Trigger the load event by setting the src
    this._largeImage.src = largeUrl

    //If load succeeds replace the src of the img 'src' with the large image. (Add it to the DOM)
    this._largeImage.onload = () => this.setImgSrc( largeUrl)

    //If load fails, go to error handler
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

    this.setImgSrc( this.fallbackUrl())
    this._renderer.setStyle(this._nativeElement, 'object-fit', 'contain');
    this.error.emit()

  }

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

    const currentSmlToLrgFn = this.smlToLrgFn();

    if (currentSmlToLrgFn) {
      const derivedUrl = currentSmlToLrgFn(url);
      devConsole.log('derivedUrl img load: ', derivedUrl)
      if (derivedUrl)
        return derivedUrl
    }

    const currentLrgUrl = this.lrgUrl();
    if (currentLrgUrl)
      return currentLrgUrl;

    // Return null and let the error handler do the rest.
    devConsole.warn('[ProgressiveImageLoader] Large image URL could not be determined. Ensure `smlToLrgFn` returns a valid URL or `lrgUrl` is set.');
    return null;

  }

  //------------------------------// 

  private setImgSrc = (src: string) =>
    this._renderer.setAttribute(this._nativeElement, 'src', src)

  private getImgSrc = () =>
    this._nativeElement.getAttribute('src')

  //------------------------------// 

}//Cls
