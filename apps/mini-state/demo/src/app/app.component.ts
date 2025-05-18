import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { devConsole } from '@spider-baby/dev-console';
import { PerformanceService, SeoService, StructuredDataService } from '@spider-baby/utils-seo';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [
    RouterModule
  ],
  selector: 'sb-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Spider Baby MiniState';

  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _structuredDataService = inject(StructuredDataService);
  private _performanceService = inject(PerformanceService);
  private _activatedRoute = inject(ActivatedRoute)
  private _titleService = inject(Title)

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Add base structured data for the whole site
    this._structuredDataService.addLibraryStructuredData();
    this._structuredDataService.addOrganizationStructuredData();

    // Initialize performance monitoring
    this._performanceService.measureCoreWebVitals();

    // Handle route changes to update canonical URLs
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {      
      // Update canonical URL based on current route
      devConsole.log('AppComponent-Router URL:', this._router.url);
      this._seoService.addCanonicalLinkRelative(this._router.url);
    });

    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {      
      // Update canonical URL based on current route
      devConsole.log('AppComponent-Router URL:', this._router.url);
      this._seoService.addCanonicalLinkRelative(this._router.url);
    });


  }
}
