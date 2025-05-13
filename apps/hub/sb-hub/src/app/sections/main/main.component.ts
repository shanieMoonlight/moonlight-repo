import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  MlDarkModeToggleMatComponent,
  MlThemePickerMatComponent,
} from '@spider-baby/material-theming/components';
import { ServiceWorkerUpdateMatComponent } from '@spider-baby/utils-seo/sw-updater-mat';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { MainNavbarComponent } from './ui/navbar/navbar.component';
import { MainNavTitleService } from './utils/nav/main-nav-title.service';

@Component({
  standalone: true,
  imports: [
    MainNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule,
    ServiceWorkerUpdateMatComponent,
  ],
  providers: [],
  selector: 'hub-main-root',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {

  protected _iconsService = inject(IconsService);
  protected _navTitle = inject(MainNavTitleService)
  protected _title = computed(() => this._navTitle.value() || 'SpiderBaby')

  //----------------------------//

  constructor() {

    this._navTitle.updateOnNavigationChange()
  }

} //Cls
