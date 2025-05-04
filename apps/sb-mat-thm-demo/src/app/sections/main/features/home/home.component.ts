import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { SbThemeShowcaseMatComponent } from '@spider-baby/material-theming/showcase';
import { SbCurrentThemeBannerComponent } from '@spider-baby/material-theming/ui';
import { NavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { ShareCurrentPageDirective } from '@spider-baby/utils-share';
import { AppConstants } from '../.././../../config/constants';
import { SeoService } from '../../../../shared/services/seo.service';
import { StructuredDataService } from '../../../../shared/services/structured-data.service';
import { CardsComponent } from "./ui/cards/cards.component";
import { HomeColorVarsComponent } from './ui/color-vars/color-vars.component';
import { HomeGettingStartedComponent } from './ui/getting-started/getting-started.component';
import { GitComponent } from "./ui/git/git.component";
import { HomePerformanceComponent } from "./ui/performance/performance.component";
import { PersistenceComponent } from "./ui/persistence/persistence.component";
import { HomeSectionHdrComponent } from "./ui/section-hdr/section-hdr.component";
import { SectionedThemesComponent } from "./ui/sectioned-themes/sectioned-themes.component";
import { UrlService } from '../../../../shared/utils/urls/url.service';


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
    SbThemeShowcaseMatComponent,
    SbCurrentThemeBannerComponent,
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
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHomeComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)
  private _urlService = inject(UrlService)
  private _structuredDataService = inject(StructuredDataService)

  //- - - - - - - - - - - - - - -//

  protected _gitRepoUrl = signal(AppConstants.GIT_REPO);
  protected _npmUrl = signal(AppConstants.NPM_PKG);

  //-----------------------------//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'SpiderBaby Material Theming | Enhanced Angular Material Theming System',
      description: 'A powerful, flexible theming system for Angular Material with dynamic theme switching, section-based theming, and Material Design 3 support.',
      url: this._urlService.combineWithBase(this._router.url),
    });

    // Add canonical link
    this._seoService.addCanonicalLink(this._urlService.combineWithBase(this._router.url));

    // Add structured data
    this._structuredDataService.addLibraryStructuredData();
  }
}




