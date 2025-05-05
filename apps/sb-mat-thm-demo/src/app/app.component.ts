import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PerformanceService, SeoService, StructuredDataService, UrlUtilsService } from '@spider-baby/utils-seo';
import { filter } from 'rxjs/operators';

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
  private _urlService = inject(UrlUtilsService)
  private _structuredDataService = inject(StructuredDataService)
  private _performanceService = inject(PerformanceService)

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Add base structured data for the whole site
    this._structuredDataService.addLibraryStructuredData();

    
    this._structuredDataService.addOrganizationStructuredData()

    // Initialize performance monitoring
    this._performanceService.measureCoreWebVitals();

    // Handle route changes to update canonical URLs
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Update canonical URL based on current route
      console.log('AppComponent-Router URL:', this._router.url);
      this._seoService.addCanonicalLinkRelative(this._router.url)
    });
  }
}
