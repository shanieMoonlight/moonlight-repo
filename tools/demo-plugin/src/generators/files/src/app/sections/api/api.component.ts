import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SeoService } from '@spider-baby/utils-seo';
import { API_ROUTES } from './config/route-data';
import { ApiNavbarComponent } from './ui/navbar/navbar.component';


@Component({
  standalone: true,
  imports: [
    MatEverythingModule,
    ApiNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule
  ],
  providers: [
  ],
  selector: '<%= prefix %>-api-root',
  templateUrl: './api.component.html',
  styleUrl: './api.component.scss',
})
export class ApiComponent {

  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  apiRoutes = signal(API_ROUTES);

  description = `Mini-State provides a simple, flexible API for managing state in a decalartive way in Angular applications. 
  It handles loading states, error messages, success notifications, and simplifies working with 
  asynchronous operations while leveraging Angular's signals for reactivity.`;

  //- - - - - - - - - - - - - - -//

  constructor() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'Mini-State API | Lightweight Signal-Based State Management for Angular',
      description: this.description,
      url: this._router.url,
      keywords: ['Angular', 'State Management', 'Signals', 'Mini-State', 'Angular library', 'Reactive State']
    });
  }

}//Cls
