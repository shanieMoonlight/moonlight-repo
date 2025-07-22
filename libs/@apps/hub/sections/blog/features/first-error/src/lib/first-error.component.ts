import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { HubAppDownloads } from '@sb-hub/core-config/downloads';
import { HubUiBtnDownloadComponent } from '@sb-hub/sections-blog/ui-buttons/downlaod';
import { SbHubPkgLinksComponent } from '@sb-hub/shared-ui/pkg-links';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { LocalFileDownloadServiceService } from '@spider-baby/utils-file-saver';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';
import { Subject } from 'rxjs';
import { CustomErrorMessagesExample, DynamicFormExample } from './code/advanced-patterns';
import { BasicFirstErrorHtmlCode, CustomErrorTemplateHtmlCode, ShowUntouchedHtmlCode } from './code/first-error-examples';
import { blurListenerCode, directiveSkeletonCode, errorsMessageMapCode, findInvalidControlsDataCode, firstErrorComponentTsCode, firstErrorComponentUsageHtmlCode, firstErrorHtmlDiplayCode, firstErrorUsageHtmlCode, fullDirectiveCode, getFirstErrorMessageCode, observeValueChangesCode, setFirstErrorMessageCode } from './code/how-to';
import { BlogConstants } from './config/constants';
import { FirstErrorDemoComponent } from './demo/demo.component';
import { SbPortalInputComponent } from '@spider-baby/utils-portal';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { HubAppImages } from '@sb-hub/core-config/images';

@Component({
  selector: 'sb-hub-blog-features-first-error',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HighlightModule,
    SbHubPkgLinksComponent,
    MatCardModule,
    SbPortalInputComponent,
    MatDividerModule,
    HubUiBtnDownloadComponent,
    HubHeroBanner2Component,
    FirstErrorDemoComponent
  ],
  templateUrl: './first-error.component.html',
  styleUrl: './first-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogFirstErrorComponent implements OnInit{


  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _codeSampleDownloader = inject(LocalFileDownloadServiceService);

  // SEO and tutorial metadata
  protected _title = BlogConstants.FirstErrorTutorial.Title;
  protected _subtitle = BlogConstants.FirstErrorTutorial.Subtitle;
  protected _description = BlogConstants.FirstErrorTutorial.Description;
  protected _gitHubRepoUrl = BlogConstants.FirstErrorTutorial.GitHubRepo;
  protected _npmPackageUrl = BlogConstants.FirstErrorTutorial.NpmPackage;
  protected readonly _bannerImg = HubAppImages.Blog.FirstErrorTutorial.placeholder;

  
  protected _showButton = signal(false);


  //- - - - - - - - - - - - - - -//


  // Code samples
  protected readonly _basicExample = BasicFirstErrorHtmlCode;
  protected readonly _customTemplateExample = CustomErrorTemplateHtmlCode;
  protected readonly _showUntouchedExample = ShowUntouchedHtmlCode;
  protected readonly _dynamicFormExample = DynamicFormExample;
  protected readonly _customErrorMessagesExample = CustomErrorMessagesExample;

  protected _directiveSkeletonCode = directiveSkeletonCode

  protected _observeValueChangesCode = observeValueChangesCode

  protected _blurListenerCode = blurListenerCode

  protected _setFirstErrorMessageCode = setFirstErrorMessageCode

  protected _findInvalidControlsDataCode = findInvalidControlsDataCode

  protected _fullDirectiveCode = fullDirectiveCode
  protected _firtErrorHtmlDiplay = firstErrorHtmlDiplayCode
  protected _errorsMessageMapCode = errorsMessageMapCode
  protected _getFirstErrorMessageCode = getFirstErrorMessageCode
  protected _firstErrorUsageHtmlCode = firstErrorUsageHtmlCode
  protected _firstErrorComponentTsCode = firstErrorComponentTsCode
  protected _firstErrorComponentUsageHtmlCode = firstErrorComponentUsageHtmlCode
  // ...existing code...


  //----------------------------//

  protected _dlClick$ = new Subject<void>();
  private _dlState = MiniStateBuilder.CreateWithObservableInput(
    this._dlClick$,
    () => this._codeSampleDownloader.download$(HubAppDownloads.FirstErrorTutorial.CodeSampleZipFile, 'first-error-code-samples.zip'))
    .setSuccessMsgFn(() => '✨ Download complete!');

  protected _errorMsg = this._dlState.error;
  protected _successMsg = this._dlState.successMsg;
  protected _dlResult = this._dlState.data;
  protected _isLoading = this._dlState.loading;

  //----------------------------//

    ngOnInit() {
    setTimeout(() =>
      this._showButton.set(true),
      2000
    );

    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Forms', 'Component', 'Tutorial', 'TypeScript', 'UI Library'],
    });

  }


}
