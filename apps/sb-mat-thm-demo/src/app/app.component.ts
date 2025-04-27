import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StructuredDataService } from './shared/services/structured-data.service';
import { SeoService } from './shared/services/seo.service';
import { PerformanceService } from './shared/services/performance.service';
import { AppConstants } from './config/constants';

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
  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private structuredDataService: StructuredDataService,
    private seoService: SeoService,
    private performanceService: PerformanceService
  ) {}

  ngOnInit() {
    // Add base structured data for the whole site
    this.structuredDataService.addLibraryStructuredData();

    // Initialize performance monitoring
    this.performanceService.measureCoreWebVitals();

    // Handle route changes to update canonical URLs
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Update canonical URL based on current route
      this.seoService.addCanonicalLink(AppConstants.DEMO_URL + this.router.url);
    });
  }
}
