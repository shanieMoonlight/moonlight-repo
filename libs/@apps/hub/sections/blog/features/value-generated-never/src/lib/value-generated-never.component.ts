import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { LocalFileDownloadServiceService } from '@spider-baby/utils-file-saver';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';
import { BlogConstants } from './config/constants';

// Code samples
import { isPlatformBrowser } from '@angular/common';
import { HubAppDownloads } from '@sb-hub/core-config/downloads';
import { HubAppImages } from '@sb-hub/core-config/images';
import { SbHubPkgLinksComponent } from '@sb-hub/shared-ui/pkg-links';
import { SbPortalInputComponent } from '@spider-baby/utils-portal';
import { Subject } from 'rxjs';
import { AppUser_Abrv_Code } from './code/appuser-entitiy';
import { GlobalConfigCode, OnModelCreatingCode, TrustedDeviceConfigCode } from './code/config';
import { TrustedDevice_Abrv_Code } from './code/device-entitiy';
import { ExceptionCode } from './code/exception';

// import { IconsService } from '@sb-hub-blog-features-value-generated-never/shared-utils/icons';

@Component({
  standalone: true,
  imports: [
    HighlightModule,
    // MatCardModule,
    // MatDividerModule,
    // HubUiBtnDownloadComponent,
    SbPortalInputComponent,
    SbHubPkgLinksComponent,
    HubHeroBanner2Component
  ],
  providers: [],
  selector: 'sb-hub-blog-features-value-generated-never',
  templateUrl: './value-generated-never.component.html',
  styleUrl: './value-generated-never.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogValueGeneratedNeverComponent {
 
  //  protected _iconsService = inject(IconsService); 
  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _platformId = inject(PLATFORM_ID);
  private _codeSampleDownloader = inject(LocalFileDownloadServiceService);
  
  protected readonly _bannerImg = HubAppImages.Blog.ValueGeneratedNeverTutorial.placeholder;

  //- - - - - - - - - - - - - - -//
  
  
  protected _title = BlogConstants.ValueGeneratedNever.Title;
  protected _subtitle = BlogConstants.ValueGeneratedNever.Subtitle;
  protected _description = BlogConstants.ValueGeneratedNever.Description;
  protected _gitHubRepoUrl = BlogConstants.ValueGeneratedNever.GitHubRepo;

  // protected _appUserCode = AppUserCode
  // protected _trustedDeviceCode = TrustedDeviceCode
  protected _appUserCode = AppUser_Abrv_Code
  protected _trustedDeviceCode = TrustedDevice_Abrv_Code
  protected _exceptionCode = ExceptionCode
  protected _trustedDeviceConfig = TrustedDeviceConfigCode
  protected _globalConfig = GlobalConfigCode
  protected _onModelCreating = OnModelCreatingCode

  //----------------------------//

  protected _dlClick$ = new Subject<void>();
  private _dlState = MiniStateBuilder.CreateWithObservableInput(
    this._dlClick$,
    () => this._codeSampleDownloader.download$(
      HubAppDownloads.DotNetDiRegTestTutorial.CodeSampleFile, 
      'ServiceCollectionReflectionHelper.cs','text/plain'))
    .setSuccessMsgFn(() => '✨ Download complete!');

  protected _errorMsg = this._dlState.error;
  protected _successMsg = this._dlState.successMsg;
  protected _dlResult = this._dlState.data;
  protected _isLoading = this._dlState.loading;
  
  protected _showButton = signal(false);

  //----------------------------//

  constructor() {

    if (isPlatformBrowser(this._platformId)) {
      setTimeout(() =>
        this._showButton.set(true),
        2000
      );
    }
    // console.log('HubBlogDotnetDiRegTestComponent-constructor');
    // this._iconsService.registerIcons();
    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: BlogConstants.ValueGeneratedNever.Keywords,
    });
  }


} //Cls
