import { Component, inject, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbDarkModeToggleMatComponent, SbThemePickerMatComponent, } from '@spider-baby/material-theming/components';
import { DynamicThemeConfigService } from '@spider-baby/material-theming/config';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AdminMainRoutes } from './config/admin-route-data';
import { ADMIN_THEME_OPTIONS } from './config/admin-theme.config';
import { AdminNavbarComponent } from './ui/navbar/navbar.component';

@Component({
  standalone: true,
  imports: [
    MatEverythingModule,
    AdminNavbarComponent,
    SbDarkModeToggleMatComponent,
    SbThemePickerMatComponent,
    RouterModule,
  ],
  providers: [],
  selector: 'rd-admin-root',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnDestroy {

  private _dynamicConfigService = inject(DynamicThemeConfigService)

  //- - - - - - - - - - - - - - -//

  adminRoutes = AdminMainRoutes;

  description = `Mini-State provides a simple, flexible API for managing state in a decalartive way in Angular applications. 
  It handles loading states, error messages, success notifications, and simplifies working with 
  asynchronous operations while leveraging Angular's signals for reactivity.`;

  //- - - - - - - - - - - - - - -//

  constructor() {
    this._dynamicConfigService.setSystemThemes(ADMIN_THEME_OPTIONS);
  }

  ngOnDestroy(): void {
    this._dynamicConfigService.resetSystemThemesToInitial()
  }
  
} //Cls
