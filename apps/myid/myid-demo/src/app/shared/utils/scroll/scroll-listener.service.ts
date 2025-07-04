import { isPlatformBrowser } from '@angular/common';
import { ElementRef, inject, Injectable, PLATFORM_ID, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, fromEvent, map, Observable, of, startWith, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollListenerService {

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  //--------------------//


  private _scrollEvent$: Observable<Event> = this.isBrowser
    ? fromEvent(window, 'scroll')
    : of(); // empty observable on server

  windowScrollPosition$ = this._scrollEvent$.pipe(
    map(() => window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
    distinctUntilChanged(),
    debounceTime(200),
    startWith(0) // Add this
  )

  windowScrollPosition = toSignal(this.windowScrollPosition$, { initialValue: 0 });


  //--------------------//

  getScrollEvent$(element: ElementRef): Observable<Event> {


    if (!this.isBrowser)
      return of()

    return fromEvent(element.nativeElement, 'scroll')

  }

  //--------------------//

  getScrollPosition$(element: ElementRef, debounceMillis = 100): Observable<number> {

    if (!this.isBrowser)
      return of(0)

    return this.getScrollEvent$(element).pipe(
      map((scrlEv: any) => scrlEv?.target?.scrollTop),
      distinctUntilChanged(),
      debounceTime(debounceMillis),
      startWith(0) // Add this
    )

  }

  //--------------------//

  getScrollPosition = (element: ElementRef, debounceMillis = 100) =>
    toSignal(this.getScrollPosition$(element, debounceMillis), { initialValue: 0 })


}//Cls
