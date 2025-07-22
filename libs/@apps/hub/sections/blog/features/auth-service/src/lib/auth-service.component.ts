import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';
// import { IconsService } from '@sb-hub-blog-features-auth-service/shared-utils/icons';

// Code samples
import { HubAppDownloads } from '@sb-hub/core-config/downloads';
import { HubAppImages } from '@sb-hub/core-config/images';
import { HubUiBtnDownloadComponent } from '@sb-hub/sections-blog/ui-buttons/downlaod';
import { SbHubPkgLinksComponent } from '@sb-hub/shared-ui/pkg-links';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { LocalFileDownloadServiceService } from '@spider-baby/utils-file-saver';
import { SbPortalInputComponent } from '@spider-baby/utils-portal';
import { Subject } from 'rxjs';
import { GuardExampleCode, UsageExampleCode } from './code/auth-service-examples';
import { BaseAuthSignalServiceCode } from './code/base-auth-service';
import { HowToImplementCode, InstallationCode, SetupCode } from './code/how-to-implement';
import { CustomJwtPayloadCode, JwtHelperCode, JwtPayloadCode } from './code/jwt-examples';
import { BlogConstants } from './config/constants';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    HighlightModule,
    // MatCardModule,
    // MatDividerModule,
    HubUiBtnDownloadComponent,
    SbPortalInputComponent,
    SbHubPkgLinksComponent,
    HubHeroBanner2Component
  ],
  providers: [],
  selector: 'sb-hub-blog-features-auth-service',
  templateUrl: './auth-service.component.html',
  styleUrl: './auth-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogAuthServiceComponent {
  //  protected _iconsService = inject(IconsService); 
  private _seoService = inject(SeoService);
  private _platformId = inject(PLATFORM_ID);
  private _router = inject(Router);
  private _codeSampleDownloader = inject(LocalFileDownloadServiceService);


  //----------------------------//

  // SEO and tutorial metadata
  protected _title = BlogConstants.AuthServiceTutorial.Title;
  protected _subtitle = BlogConstants.AuthServiceTutorial.Subtitle;
  protected _description = BlogConstants.AuthServiceTutorial.Description;
  protected _gitHubRepoUrl = BlogConstants.AuthServiceTutorial.GitHubRepo;
  protected _npmPackageUrl = BlogConstants.AuthServiceTutorial.NpmPackage;
  protected readonly _bannerImg = HubAppImages.Blog.AuthServiceTutorial.placeholder;

  protected _showButton = signal(false);

  //- - - - - - - - - - - - - - -//
  // Code samples for tutorial
  protected _jwtPayloadCode = JwtPayloadCode;
  protected _jwtHelperCode = JwtHelperCode;
  protected _baseAuthSignalServiceCode = BaseAuthSignalServiceCode;
  // protected _authSignalServiceCode = AuthSignalServiceCode;
  protected _usageExampleCode = UsageExampleCode;
  protected _guardExampleCode = GuardExampleCode;
  protected _customJwtPayloadCode = CustomJwtPayloadCode;
  protected _howToImplementCode = HowToImplementCode;
  protected _installationCode = InstallationCode;
  protected _setupCode = SetupCode;

  //----------------------------//

  protected _dlClick$ = new Subject<void>();
  private _dlState = MiniStateBuilder.CreateWithObservableInput(
    this._dlClick$,
    () => this._codeSampleDownloader.download$(HubAppDownloads.AuthServiceTutorial.CodeSampleZipFile, 'auth-service-code-samples.zip'))
    .setSuccessMsgFn(() => '✨ Download complete!');

  protected _errorMsg = this._dlState.error;
  protected _successMsg = this._dlState.successMsg;
  protected _dlResult = this._dlState.data;
  protected _isLoading = this._dlState.loading;

  //----------------------------//

  constructor() {

    if (isPlatformBrowser(this._platformId)) {
      setTimeout(() =>
        this._showButton.set(true),
        2000
      );
    }


    // this._iconsService.registerIcons();
    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Angular library'],
    });
  }

} //Cls
