import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SbThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { ThemeOption } from '@spider-baby/material-theming/config';
import { SbApplyThemeDirective } from '@spider-baby/material-theming/directives';
import { SbThemeService } from '@spider-baby/material-theming/service';
import { HighlightModule } from 'ngx-highlightjs';
import { AUTUMN_THEME, DEFAULT_SEAONAL_THEME, SPRING_THEME, SUMMER_THEME, WINTER_THEME } from '../../config/seasonal-theme.config';
import { ThemeHierarchyDiagramComponent } from './ui/heirarchy-diagram.component';
import { SeasonCardData, SeasonInfoCardComponent } from './ui/season-info.component';

//#######################################################//

const seasonData: SeasonCardData[] = [
  {
    title: 'Spring',
    description: 'Fresh and vibrant colors.',
    icon: 'local_florist', // Example icon
    theme: SPRING_THEME, // Replace with actual theme
    routePath: '/seasons/spring'
  },
  {
    title: 'Summer',
    description: 'Warm and bright palettes.',
    icon: 'wb_sunny', // Example icon
    theme: SUMMER_THEME,
    routePath: '/seasons/summer'
  },
  {
    title: 'Autumn',
    description: 'Earthy and cozy tones.',
    icon: 'forest', // Example icon
    theme: AUTUMN_THEME,
    routePath: '/seasons/autumn'
  },
  {
    title: 'Winter',
    description: 'Cool and crisp aesthetics.',
    icon: 'ac_unit', // Example icon
    theme: WINTER_THEME,
    routePath: '/seasons/winter'
  }
]

//#######################################################//

@Component({
  selector: 'sb-seasons-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    SeasonInfoCardComponent,
    RouterModule,
    ThemeHierarchyDiagramComponent,
    SbApplyThemeDirective,
    SbThemePickerMatComponent,
    HighlightModule,
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonalHomeComponent {
  
  private _themeService = inject(SbThemeService);
  
  
  protected _seasonData = signal(seasonData);
  protected _availableThemes = this._themeService.availableThemes
  protected _currentTheme = this._themeService.currentTheme
  
  constructor() {
    this._themeService.setTheme(DEFAULT_SEAONAL_THEME)
  }
  
  
  changeTheme(opt: ThemeOption) {
    this._themeService.setTheme(opt)
  }


}//Cls