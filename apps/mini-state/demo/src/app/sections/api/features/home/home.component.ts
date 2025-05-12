import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SbMatApiNavCardComponent } from '@spider-baby/ui-cards/api';
import { SeoService } from '@spider-baby/utils-seo';
import { AppImages } from '../../../../config/images';
import { API_ROUTES } from '../../config/route-data';

//##############################################//

@Component({
  selector: 'sb-api-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    SbMatApiNavCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiHomeComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  apiRoutes = signal(API_ROUTES);
  title = 'Mini-State Docs';
  subtitle = 'A lightweight, signals-based state management library for Angular applications';
  description = `Mini-State provides a simple, flexible API for managing state in a decalartive way in Angular applications. 
  It handles loading states, error messages, success notifications, and simplifies working with 
  asynchronous operations while leveraging Angular's signals for reactivity.`;
  heroImageUrl = AppImages.Logo.default
  heroImageAlt = 'Mini-State Logo';

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'API Mini-State | Lightweight Signal-Based State Management for Angular',
      description: this.description,
      url: this._router.url,
      keywords: ['API', 'Angular', 'State Management', 'Signals', 'Mini-State', 'Angular library', 'Reactive State']
    });
  }

}



