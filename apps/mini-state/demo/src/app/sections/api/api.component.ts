import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { SeoService } from '@spider-baby/utils-seo';
import { ApiNavbarComponent } from './ui/navbar/navbar.component';


@Component({
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    ApiNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule
  ],
  providers: [
  ],
  selector: 'sb-api-root',
  templateUrl: './api.component.html',
  styleUrl: './api.component.scss',
})
export class ApiComponent  {

  private _seoService = inject(SeoService);
  private _router = inject(Router);
  
  //- - - - - - - - - - - - - - -//

  description = `Mini-State provides a simple, flexible API for managing state in a decalartive way in Angular applications. 
  It handles loading states, error messages, success notifications, and simplifies working with 
  asynchronous operations while leveraging Angular's signals for reactivity.`;

  // //- - - - - - - - - - - - - - -//

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
