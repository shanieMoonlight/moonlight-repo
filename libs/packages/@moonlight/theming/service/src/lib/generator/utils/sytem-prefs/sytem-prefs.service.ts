import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SytemPrefsService {

  private _platformId = inject(PLATFORM_ID);
  private _destroyRef = inject(DestroyRef);

  // RxJS Observable for reactive programming
  private _prefersDarkModeBs: BehaviorSubject<boolean>
  prefersDarkMode$: Observable<boolean>
  prefersDarkMode: Signal<boolean>

  //-----------------------------//

  constructor() {
    this._prefersDarkModeBs = new BehaviorSubject<boolean>(this.getInitialPreference());
    this.prefersDarkMode$ = this._prefersDarkModeBs.asObservable()
    this.prefersDarkMode = toSignal(this.prefersDarkMode$, { initialValue: this.getInitialPreference() });

    this.initializeListeners();
  }

  //-----------------------------//

  /**
   * Force refresh the current system preference
   */
  refreshPreference(): void {
    if (!this.isBrowser())
      return

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.updatePreference(isDarkMode);
  }

  //-----------------------------//
  // PRIVATE METHODS
  //-----------------------------//

  private isBrowser = (): boolean =>
    isPlatformBrowser(this._platformId)

  //- - - - - - - - - - - - - - -//

  // Private methods
  private canDetectColorSchemePreference = (): boolean =>
    this.isBrowser() && !!window.matchMedia;

  //- - - - - - - - - - - - - - -//

  private getInitialPreference = (): boolean =>
    this.canDetectColorSchemePreference()
    && window.matchMedia('(prefers-color-scheme: dark)').matches;

  //- - - - - - - - - - - - - - -//

  private initializeListeners(): void {

    if (!this.canDetectColorSchemePreference())
      return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Modern API (addEventListener)
    const listener = (e: MediaQueryListEvent) => this.updatePreference(e.matches);
    mediaQuery.addEventListener('change', listener);

    // Clean up listener when service is destroyed
    this._destroyRef.onDestroy(() =>
      mediaQuery.removeEventListener('change', listener))
  }

  //- - - - - - - - - - - - - - -//

  private updatePreference = (isDarkMode: boolean) =>
    this._prefersDarkModeBs.next(isDarkMode);

  //-----------------------------//

}//Cls