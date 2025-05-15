import { Component, inject, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicThemeConfigService } from '@spider-baby/material-theming/config';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { PROD_ADMIN_THEME_CONFIG } from './config/prod-admin-theme.config';

@Component({
  standalone: true,
  imports: [
    RouterModule,
  ],
  providers: [],
  selector: 'rd-product-admin-root',
  templateUrl: './product-admin.component.html',
  styleUrl: './product-admin.component.scss',
})
export class ProductAdminComponent implements OnDestroy {

  iconsService = inject(IconsService);
  private _dynamicConfigService= inject( DynamicThemeConfigService)

  //- - - - - - - - - - - - - - -//

  constructor() {    
    this._dynamicConfigService.setSystemThemes(PROD_ADMIN_THEME_CONFIG.themeOptions);

  }

  ngOnDestroy(): void {
    this._dynamicConfigService.resetSystemThemesToInitial()
  }
  
} //Cls
