import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SbDarkModeToggleMatComponent, SbThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { SeoService, StructuredDataService } from '@spider-baby/utils-seo';
import { ApiNavbarComponent } from './ui/navbar/navbar.component';
import { API_ROUTES } from './config/route-data';

@Component({
  selector: 'sb-api',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterOutlet,
    RouterModule,
    SbDarkModeToggleMatComponent,
    SbThemePickerMatComponent,
    ApiNavbarComponent
  ],
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)
  private _structuredDataService = inject(StructuredDataService)

  //- - - - - - - - - - - - - - -//

  apiRoutes = signal(API_ROUTES);
  
  //-----------------------------//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'API Documentation - SpiderBaby Material Theming',
      description: 'Complete API reference and documentation for the SpiderBaby Material Theming library. Learn about theme services, CSS variables, and implementation examples.',
      url: this._router.url,
    });

    // Add structured data
    this._structuredDataService.addLibraryStructuredData();
  }
}
