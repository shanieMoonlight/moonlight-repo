import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';
import { BlogConstants } from './config/constants';
import { LocalFileDownloadServiceService } from '@spider-baby/utils-file-saver';
import { MiniStateBuilder } from '@spider-baby/mini-state';

// Code samples
import { HubAppDownloads } from '@sb-hub/core-config/downloads';
import { HubUiBtnDownloadComponent } from '@sb-hub/sections-blog/ui-buttons/downlaod';
import { SbHubPkgLinksComponent } from '@sb-hub/shared-ui/pkg-links';
import { SbPortalInputComponent } from '@spider-baby/utils-portal';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { TestToAssertLibrary_RegistersInterfacesCode, TestToAssertLibrary_RegistersInterfacesCode_WithIconfigurationCode } from './code/test-methods';
import { MyFancyOptionsCode, MyFancySetupExtensionsCode } from './code/library-setup';
import { HubAppImages } from '@sb-hub/core-config/images';
import { ServiceCollectionReflectionHelperCode, UsingDryHelperMethodCode } from './code/dry-helper-method';


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
  selector: 'sb-hub-blog-features-dotnet-di-reg-test',
  templateUrl: './dotnet-di-reg-test.component.html',
  styleUrl: './dotnet-di-reg-test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogDotnetDiRegTestComponent {
 
  //  protected _iconsService = inject(IconsService); 
  private _seoService = inject(SeoService);
  private _platformId = inject(PLATFORM_ID);
  private _router = inject(Router);
  private _codeSampleDownloader = inject(LocalFileDownloadServiceService);

  //- - - - - - - - - - - - - - -//
  
  protected _title = BlogConstants.AuthServiceTutorial.Title;
  protected _subtitle = BlogConstants.AuthServiceTutorial.Subtitle;
  protected _description = BlogConstants.AuthServiceTutorial.Description;
  protected _gitHubRepoUrl = BlogConstants.AuthServiceTutorial.GitHubRepo;
  protected readonly _bannerImg = HubAppImages.Blog.DotNetDiTestTutorial.placeholder;

  protected _showButton = signal(false);

  //- - - - - - - - - - - - - - -//
  
  // Code samples for tutorial
  protected _librarySetupOptions = MyFancyOptionsCode;
  protected _librarySetupExtensions = MyFancySetupExtensionsCode;
  protected _librarySpecificTestCode = TestToAssertLibrary_RegistersInterfacesCode;
  protected _librarySpecific_IConfig_TestCode = TestToAssertLibrary_RegistersInterfacesCode_WithIconfigurationCode;
  protected _genericTestCode = ServiceCollectionReflectionHelperCode;
  protected _genericTestUsageCode = UsingDryHelperMethodCode;

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
  
  //----------------------------//

  constructor() {

    if (isPlatformBrowser(this._platformId)) {
      setTimeout(() =>
        this._showButton.set(true),
        2000
      );
    }
    console.log('HubBlogDotnetDiRegTestComponent-constructor');
    // this._iconsService.registerIcons();
    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['.Net', 'IServiceCollection', 'Dependency Injection', 'DI Registration', 'Unit Testing', 'C#', '.Net Core', '.Net 8', '.Net 9', 'Reflection'],
    });
  }


} //Cls
