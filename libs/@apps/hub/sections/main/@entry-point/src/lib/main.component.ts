import { Component, computed, inject, OnDestroy, OnInit, DOCUMENT } from '@angular/core';
import { RouterModule } from '@angular/router';
import {  MlDarkModeToggleMatComponent,  MlThemePickerMatComponent,} from '@spider-baby/material-theming/components';
import { ServiceWorkerUpdateMatComponent } from '@spider-baby/utils-seo/sw-updater-mat';
import { IconsService } from '@sb-hub/shared-utils/icons';
import { HubMainNavbarComponent } from '@sb-hub/sections-main/ui/nav';
import { MainNavTitleService } from '@sb-hub/sections-main/utils/title';


@Component({
  standalone: true,
  imports: [
    HubMainNavbarComponent,
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
export class HubMainComponent implements OnInit, OnDestroy{

  protected _iconsService = inject(IconsService);
  protected _navTitle = inject(MainNavTitleService);
  private _document = inject(DOCUMENT);
  protected _title = computed(() => this._navTitle.title() || 'SpiderBaby');

  //----------------------------//
  
  constructor() {
    this._navTitle.updateOnNavigationChange();
    this._iconsService.registerIcons()
  }

  //----------------------------//
  
  ngOnInit(): void {
    this._document.body.classList.add('use-slide-transition');
  }

  ngOnDestroy(): void {
    this._navTitle.unsubscribe()
    this._document.body.classList.remove('use-slide-transition'); 
  }
  

} //Cls
