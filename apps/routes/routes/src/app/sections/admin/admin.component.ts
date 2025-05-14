import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  MlDarkModeToggleMatComponent,
  MlThemePickerMatComponent,
} from '@spider-baby/material-theming/components';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SeoService } from '@spider-baby/utils-seo';
import { AdminRoutes } from './config/admin-route-data';
import { AdminNavbarComponent } from './ui/navbar/navbar.component';
import { DynamicThemeConfigService } from '@spider-baby/material-theming/config';
import { ADMIN_THEME_CONFIG } from './config/admin-theme.config';

@Component({
  standalone: true,
  imports: [
    MatEverythingModule,
    AdminNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule,
  ],
  providers: [],
  selector: 'rd-admin-root',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnDestroy{
  
  private _dynamicConfigService= inject( DynamicThemeConfigService)
  
  //- - - - - - - - - - - - - - -//

  adminRoutes = signal(AdminRoutes);

  description = `Mini-State provides a simple, flexible API for managing state in a decalartive way in Angular applications. 
  It handles loading states, error messages, success notifications, and simplifies working with 
  asynchronous operations while leveraging Angular's signals for reactivity.`;

  //- - - - - - - - - - - - - - -//

  constructor() {    
    this._dynamicConfigService.setSystemThemes(ADMIN_THEME_CONFIG.themeOptions);

  }
  ngOnDestroy(): void {
    this._dynamicConfigService.resetSystemThemesToInitial()
  }
} //Cls
