import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ApiRouteData, SbMatApiNavCardComponent } from '@spider-baby/ui-cards/api';
import { SearchComponent } from '../../../../shared/search/component/search.component';
import { SeoService } from '@spider-baby/utils-seo';
import { AppImages } from '../../../../config/images';
import { Router } from '@angular/router';

//##############################################//


const API_ROUTES: ApiRouteData[] = [
  {
    title: 'MiniState',
    description: 'Core class for managing async operations with automatic handling of loading states, errors, and success messages.',
    icon: 'change_history',
    route: '/api/mini-state',
    color: 'primary'
  },
  {
    title: 'MiniStateBuilder',
    description: 'Factory for creating MiniState instances for common async operation patterns including reactive inputs.',
    icon: 'construction',
    route: '/api/mini-state-builder',
    color: 'secondary'
  },
  {
    title: 'MiniCrudState',
    description: 'Extended MiniState for streamlined CRUD operations with automatic client-side data updates.',
    icon: 'table_view',
    route: '/api/mini-state-crud',
    color: 'tertiary'
  },
  {
    title: 'MiniStateCombined',
    description: 'Utility for combining multiple MiniState instances for unified loading, error, and success handling.',
    icon: 'merge_type',
    route: '/api/mini-state-combined',
    color: 'primary'
  },
  {
    title: 'MiniStateUtility',
    description: 'Helper methods for working with multiple MiniState instances and combining their signals/observables.',
    icon: 'handyman',
    route: '/api/mini-state-utility',
    color: 'secondary'
  }
]

//##############################################//


@Component({
  selector: 'sb-api-home',
  imports: [
    SbMatApiNavCardComponent,
    SearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiHomeComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);

  // //- - - - - - - - - - - - - - -//

  apiRoutes = signal(API_ROUTES);
  title = 'Mini-State Demo';
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



