import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MlThemeShowcaseMatComponent } from '@spider-baby/material-theming/showcase';
import { MlCurrentThemeBannerComponent } from '@spider-baby/material-theming/ui';
import { NavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { ShareCurrentPageDirective } from '@spider-baby/utils-share';
import { AppConstants } from '../.././../../config/constants';
import { CardsComponent } from "./ui/cards/cards.component";
import { HomeColorVarsComponent } from './ui/color-vars/color-vars.component';
import { HomeGettingStartedComponent } from './ui/getting-started/getting-started.component';
import { GitComponent } from "./ui/git/git.component";
import { HomePerformanceComponent } from "./ui/performance/performance.component";
import { PersistenceComponent } from "./ui/persistence/persistence.component";
import { HomeSectionHdrComponent } from "./ui/section-hdr/section-hdr.component";
import { SectionedThemesComponent } from "./ui/sectioned-themes/sectioned-themes.component";


@Component({
  selector: 'sb-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    NavigateNewWindowDirective,
    MlThemeShowcaseMatComponent,
    MlCurrentThemeBannerComponent,
    HomeGettingStartedComponent,
    HomePerformanceComponent,
    HomeColorVarsComponent,
    PersistenceComponent,
    SectionedThemesComponent,
    HomeSectionHdrComponent,
    GitComponent,
    CardsComponent,
    ShareCurrentPageDirective
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  
  protected _gitRepoUrl = signal(AppConstants.GIT_REPO)
  protected _npmUrl = signal(AppConstants.NPM_PKG)

}




