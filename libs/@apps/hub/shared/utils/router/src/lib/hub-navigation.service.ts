import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { devConsole } from '@spider-baby/dev-console';
import { filter, map, tap } from 'rxjs';

/**
 * Returns routes without leading slashes
 */
@Injectable({
  providedIn: 'root',
})
export class HubRouterUtilsService {
  private _router = inject(Router);

  currentRoute$ = this._router.events // Access the router events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd), // Filter for NavigationEnd events
      map((event) => event.urlAfterRedirects || event.url), // Use urlAfterRedirects to get the final URL
      tap((x) => devConsole.log('route', x)), // For debugging
      map((r) => r.replace(/^\/+/g, '')) // Remove leading slashes
    );

  currentRoute = toSignal(this.currentRoute$);
} //Cls
