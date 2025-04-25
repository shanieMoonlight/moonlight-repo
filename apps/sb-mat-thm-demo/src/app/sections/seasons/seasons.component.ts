import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { DynamicThemeConfigService } from '@spider-baby/material-theming/config';
import { ThemeTransitionIndicatorComponent } from '../../shared/utils/theme-transition/theme-transition-indicator.component';
import { SEASON_THEME_CONFIG } from './config/seasonal-theme.config';
import { SeasonalNavbarComponent } from './ui/navbar/navbar.component';


@Component({
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    SeasonalNavbarComponent,
    MlDarkModeToggleMatComponent,
    RouterModule,
    ThemeTransitionIndicatorComponent
  ],
  selector: 'sb-seasons-root',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonsComponent  implements OnDestroy{
  

  constructor(private dynamicConfigService: DynamicThemeConfigService) {

    // Replace the central theme options with the seasonal ones
    this.dynamicConfigService.setSystemThemes(SEASON_THEME_CONFIG.themeOptions);

  }


  ngOnDestroy(): void {

    // Remove our custom local themes , so when we leave the seasons section
    // we are back to the default themes. ThemeService will handle setting the default theme in the new section.
    this.dynamicConfigService.resetSystemThemesToInitial()

  }
  
}//Cls
