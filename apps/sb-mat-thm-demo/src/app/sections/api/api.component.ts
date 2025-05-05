import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { SeoService, StructuredDataService, UrlUtilsService } from '@spider-baby/utils-seo';
import { ApiNavbarComponent } from './ui/navbar/navbar.component';

@Component({
  selector: 'sb-api',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    RouterOutlet,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    ApiNavbarComponent
  ],
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)
  private _structuredDataService = inject(StructuredDataService)
  private _urlService = inject(UrlUtilsService)

  //-----------------------------//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'API Documentation - SpiderBaby Material Theming',
      description: 'Complete API reference and documentation for the SpiderBaby Material Theming library. Learn about theme services, CSS variables, and implementation examples.',
      url: this._urlService.combineWithBase(this._router.url),
    });

    // Add canonical link
    this._seoService.addCanonicalLink(this._urlService.combineWithBase(this._router.url));

    // Add structured data
    this._structuredDataService.addLibraryStructuredData();
  }
}
