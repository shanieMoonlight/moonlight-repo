import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { ApiRouteData, SbMatApiNavCardComponent } from '@spider-baby/ui-cards/api';
import { SeoService } from '../../../../shared/services/seo.service';
import { UrlService } from '../../../../shared/utils/urls/url.service';

//###############################################//

export const API_ROUTES: ApiRouteData[] = [
  {
    title: 'Theme Service API',
    description: 'Comprehensive documentation of ThemeService methods and properties for managing themes in your application.',
    icon: 'palette',
    route: '/api/service-api',
    color: 'primary'
  },
  {
    title: 'CSS Variables',
    description: 'Complete list of CSS variables available in the theming system for customizing your application.',
    icon: 'code',
    route: '/api/variables-list',
    color: 'secondary'
  },
  {
    title: 'Theme Picker API',
    description: 'Documentation for the Theme Picker component, including examples and usage.',
    icon: 'palette',
    route: '/api/theme-picker-api',
    color: 'primary'
  },
  {
    title: 'Dark Mode Toggle API',
    description: 'Documentation for the Dark Mode Toggle component, including examples and usage.',
    icon: 'toggle_on',
    route: '/api/dark-mode-toggle-api',
    color: 'secondary'
  },
  {
    title: 'Apply Theme Directive API',
    description: 'Documentation for the Apply Theme directive, including examples and usage.',
    icon: 'brush',
    route: '/api/apply-theme-api',
    color: 'tertiary'
  },
]

//###############################################//

@Component({
  selector: 'sb-api-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    SbMatApiNavCardComponent
  ]
})
export class ApiHomeComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)
  private _urlService = inject(UrlService)

  //- - - - - - - - - - - - - - -//

  _apiRoutes = signal(API_ROUTES)

  //-----------------------------//

  ngOnInit() {
    // Set SEO metadata specific to the API Home page
    this._seoService.updateMetadata({
      title: 'API Documentation Home - SpiderBaby Material Theming',
      description: 'Explore the API documentation for SpiderBaby Material Theming. Find CSS variables, theme service APIs, and implementation guides for Angular Material theming.',
      url: this._urlService.combineWithBase(this._router.url),
    });

    // Add canonical link
    this._seoService.addCanonicalLink(this._urlService.combineWithBase(this._router.url));
  }

}//Cls
