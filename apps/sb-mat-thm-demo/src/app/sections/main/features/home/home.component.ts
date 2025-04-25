import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from '@spider-baby/material-theming/components';
import { DEFAULT_COLOR_TONES } from '@spider-baby/material-theming/config';
import { MlThemeShowcaseMatComponent } from '@spider-baby/material-theming/showcase';
import { MlCurrentThemeBannerComponent } from  '@spider-baby/material-theming/ui';
import { NavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { AppConstants } from '../.././../../config/constants';
import { HomeGettingStartedComponent } from './ui/getting-started/getting-started.component';
import { HomePerformanceComponent } from "./ui/performance/performance.component";
import { HomeColorVarsComponent } from './ui/color-vars/color-vars.component';
import { PersistenceComponent } from "./ui/persistence/persistence.component";
import { SectionedThemesComponent } from "./ui/sectioned-themes/sectioned-themes.component";
import { HomeSectionHdrComponent } from "./ui/section-hdr/section-hdr.component";
import { GitComponent } from "./ui/git/git.component";
import { CardsComponent } from "./ui/cards/cards.component";
@Component({
  selector: 'sb-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent,
    MlThemeShowcaseMatComponent,
    MlCurrentThemeBannerComponent,
    NavigateNewWindowDirective,
    HomeGettingStartedComponent,
    HomePerformanceComponent,
    HomeColorVarsComponent,
    PersistenceComponent,
    SectionedThemesComponent,
    HomeSectionHdrComponent,
    GitComponent,
    CardsComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  protected _tones = signal(DEFAULT_COLOR_TONES)

  protected _gitRepoUrl = signal(AppConstants.GIT_REPO)

  

}




