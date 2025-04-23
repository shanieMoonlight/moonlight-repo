import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@moonlight/material/theming/components';
import { ThemeTransitionIndicatorComponent } from '../../shared/utils/theme-transition/theme-transition-indicator.component';
import { SeasonalNavbarComponent } from './ui/navbar/navbar.component';
import { ThemeAndModeSetup } from '@moonlight/material/theming/config';
import { SEASON_THEME_CONFIG } from './config/seasonal-theme.config';
import { ThemeService } from '@moonlight/material/theming/service';


@Component({
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    SeasonalNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    RouterModule,
    ThemeTransitionIndicatorComponent
  ],
  providers: [
    ThemeAndModeSetup.provideThemingModule(SEASON_THEME_CONFIG)
  ],
  selector: 'ml-seasons-root',
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonsComponent {
  title = 'material-theming-demo';

  
  private themeService = inject(ThemeService);
/**
 *
 */
constructor() {
  
  this.themeService.refreshTheme();
  
}

}
