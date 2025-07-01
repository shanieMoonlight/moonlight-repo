import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, fromEvent, map, Observable, of, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollListenerService {

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private _scrollEvent$: Observable<Event> = this.isBrowser
    ? fromEvent(window, 'scroll')
    : of(); // empty observable on server

  scrollPosition$ = this._scrollEvent$.pipe(
    map(() => window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
    distinctUntilChanged(),
    debounceTime(200),
    startWith(0) // Add this
  )
  scrollPosition = toSignal(this.scrollPosition$, { initialValue: 0 });

}
