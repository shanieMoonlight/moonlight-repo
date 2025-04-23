import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ThemeService } from '@moonlight/material/theming/service';
import { AUTUMN_THEME, DEFAULT_SEAONAL_THEME, SPRING_THEME, SUMMER_THEME, WINTER_THEME } from '../../config/seasonal-theme.config';
import { SeasonCardData, SeasonInfoCardComponent } from './ui/season-info.component';
import { ThemePickerComponent } from "../../../../shared/ui/theme-picker/theme-picker.component";
import { ThemeOption } from '@moonlight/material/theming/config';
import { MatListModule } from '@angular/material/list';

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
  selector: 'ml-seasons-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    SeasonInfoCardComponent,
    RouterModule,
    ThemePickerComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonalHomeComponent {
  
  private _themeService = inject(ThemeService);
  
  
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