import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbDarkModeToggleMatComponent, SbThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { ServiceWorkerUpdateMatComponent } from '@spider-baby/utils-seo/sw-updater-mat';
import { IconsService } from '../../shared/utils/icons/icons.service';
import { NavbarComponent } from './ui/navbar/navbar.component';


@Component({
  standalone: true,
  imports: [
    NavbarComponent,
    SbDarkModeToggleMatComponent,
    SbThemePickerMatComponent,
    RouterModule,
    ServiceWorkerUpdateMatComponent
  ],
  providers: [
  ],
  selector: 'sb-main-root',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  
  iconsService = inject(IconsService)

}//Cls
