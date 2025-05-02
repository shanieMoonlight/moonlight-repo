import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PerformanceService } from './shared/services/performance.service';
import { SeoService } from './shared/services/seo.service';
import { StructuredDataService } from './shared/services/structured-data.service';
import { UrlService } from './shared/utils/urls/url.service';

@Component({
  selector: 'sb-mat-demo-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
  styles: `    
 :host {
   display: block;
   position: relative;
 }
 `
})
export class AppComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)
  private _urlService = inject(UrlService)
  private _structuredDataService = inject(StructuredDataService)
  private _performanceService = inject(PerformanceService)

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Add base structured data for the whole site
    this._structuredDataService.addLibraryStructuredData();

    // Initialize performance monitoring
    this._performanceService.measureCoreWebVitals();

    // Handle route changes to update canonical URLs
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Update canonical URL based on current route
      this._seoService.addCanonicalLink(this._urlService.combineWithBase(this._router.url));
    });
  }
}
