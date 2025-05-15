import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppImages } from '../../../../config/images';
import { AdminNavCardComponent } from '../../../../shared/ui/admin-nav-card/admin-nav-card.component';
import { AdminMainRoutes } from '../../config/admin-route-data';
import { DynamicThemeConfigService } from '@spider-baby/material-theming/config';
import { ADMIN_THEME_CONFIG } from '../../config/admin-theme.config';

//##############################################//

@Component({
  selector: 'rd-admin-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [AdminNavCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomeComponent {

  private _dynamicConfigService= inject( DynamicThemeConfigService)

  //- - - - - - - - - - - - - - -//

  _adminRoutes = AdminMainRoutes

  _title = 'Admin Section';
  _subtitle = 'Separate section for admin tasks, with its own routes and sections';
  _heroImageUrl = AppImages.Logo.default;
  _heroImageAlt = 'SpiderBaby Route Defs Logo';
  
  //- - - - - - - - - - - - - - -//
  
  constructor() {    
    this._dynamicConfigService.setSystemThemes(ADMIN_THEME_CONFIG.themeOptions);
  }



}
