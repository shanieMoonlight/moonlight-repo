import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppImages } from '../../../../config/images';
import { AdminNavCardComponent } from '../../../../shared/ui/admin-nav-card/admin-nav-card.component';
import { AdminRoutes } from '../../config/admin-route-data';
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

  _adminRoutes = AdminRoutes

  _title = 'SpiderBaby Route Defs Demo';
  _subtitle = 'Comprehensive documentation and guides Route Defs Demo system';
  _description = `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`;
  _heroImageUrl = AppImages.Logo.default;
  _heroImageAlt = 'SpiderBaby Route Defs Logo';
  
  //- - - - - - - - - - - - - - -//
  
  constructor() {    
    this._dynamicConfigService.setSystemThemes(ADMIN_THEME_CONFIG.themeOptions);
  }



}
