import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { ApiRouteData, SbMatApiNavCardComponent } from '@sb-hub/ui-cards/api';
import { SbNavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { SeoService, StructuredDataService } from '@spider-baby/utils-seo';
import { ShareCurrentPageDirective } from '@spider-baby/utils-share';
import { AppConstants } from '../.././../../config/constants';
import { FirebaseImages } from '../../config/images';

//###############################################//

export const API_ROUTES: ApiRouteData[] = [
  {
    title: 'GIT Secrets',
    description: 'Handling secrets in your git repository is crucial for security.',
    icon: 'git',
    isSvgIcon: true,
    route: '/firebase/git-secrets',
    color: 'primary'
  },
  {
    title: 'Firebase Deploy',
    description: 'Deploying your app to Firebase Hosting is a breeze.',
    icon: 'rocket_launch',
    isSvgIcon: false,
    route: '/firebase/deploy',
    color: 'secondary'
  }
]

//###############################################//

@Component({
  selector: 'sb-tutorials-firebase-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    SbNavigateNewWindowDirective,
    SbMatApiNavCardComponent,
    ShareCurrentPageDirective
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirebaseHomeComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)
  private _structuredDataService = inject(StructuredDataService)

  //- - - - - - - - - - - - - - -//

  protected _gitRepoUrl = signal(AppConstants.GIT_REPO)
  protected _fireBaseLogoUrl = signal(FirebaseImages.logo)
  _apiRoutes = signal(API_ROUTES)

  //-----------------------------//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'SpiderBaby Tutorials |Tutorials for Angular so we never forget again',
      description: 'Reminders...',
      url: this._router.url,
    });

    // Add structured data
    this._structuredDataService.addLibraryStructuredData();
  }
}




