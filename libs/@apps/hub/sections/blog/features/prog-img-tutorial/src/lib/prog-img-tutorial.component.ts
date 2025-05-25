import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HubAppDownloads } from '@sb-hub/core-config/downloads';
import { HubAppImages } from '@sb-hub/core-config/images';
import { SbHubPkgLinksComponent } from '@sb-hub/shared-ui/pkg-links';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';

// Import code samples
import { HubUiBtnDownloadComponent } from '@sb-hub/sections-blog/ui-buttons/downlaod';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { LocalFileDownloadServiceService } from '@spider-baby/utils-file-saver';
import { SbPortalInputComponent, SbPortalOutletComponent } from '@spider-baby/utils-portal';
import { Subject } from 'rxjs';
import { ComponentBasicCode } from './code/component-basic';
import { ComponentStyleCode } from './code/component-style';
import { ComponentTemplateCode } from './code/component-template';
import { DirectiveBasicCode } from './code/directive-basic';
import { DirectiveImplementationCode } from './code/directive-implementation';
import { FallBackConstsTsCode } from './code/fallback-consts';
import { FallbackInputCode } from './code/fallback-input';
import {
  BasicUsageExample,
  FallbackImageExample,
  ObjectFitExample,
  PredefinedFunctionsExample,
  PredefinedFunctionsTemplateExample,
  TransformFunctionExample,
  ViewTransitionsExample
} from './code/html-examples';
import { ImageLoadingCode } from './code/image-loading';
import { PredefinedFunctionsCode } from './code/predefined-functions';
import { UsageExampleCode } from './code/usage-example';
import { BlogConstants } from './config/constants';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatEverythingModule,
    RouterModule,
    HighlightModule,
    HubHeroBanner2Component,
    HubUiBtnDownloadComponent,
    SbPortalInputComponent,
    SbMatNotificationsModalComponent,
    SbHubPkgLinksComponent
  ],
  providers: [LocalFileDownloadServiceService],
  selector: 'sb-hub-blog-features-prog-img-tutorial',
  templateUrl: './prog-img-tutorial.component.html',
  styleUrl: './prog-img-tutorial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogProgImgTutorialComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _codeSampleDownloader = inject(LocalFileDownloadServiceService);

  //- - - - - - - - - - - - - - -//

  // Title and SEO properties
  protected _title = BlogConstants.ProgImgTutorial.Title;
  protected _subtitle = BlogConstants.ProgImgTutorial.Subtitle;
  protected _description = BlogConstants.ProgImgTutorial.Description;

  // Code samples for displaying in the tutorial  // Code samples from Typescript files
  protected readonly _directiveBasicCode = DirectiveBasicCode;
  protected readonly _directiveImplementationCode = DirectiveImplementationCode;
  protected readonly _imageLoadingCode = ImageLoadingCode;
  protected readonly _componentBasicCode = ComponentBasicCode;
  protected readonly _componentTemplateCode = ComponentTemplateCode;
  protected readonly _componentStyleCode = ComponentStyleCode;
  protected readonly _usageExampleCode = UsageExampleCode;
  protected readonly _predefinedFunctionsCode = PredefinedFunctionsCode;
  protected readonly _fallbackConsts = FallBackConstsTsCode;
  // HTML code examples (extracted from the template)
  protected readonly _basicUsageExample = BasicUsageExample;
  protected readonly _transformFunctionExample = TransformFunctionExample;
  protected readonly _viewTransitionsExample = ViewTransitionsExample;
  protected readonly _fallbackImageExample = FallbackImageExample;
  protected readonly _objectFitExample = ObjectFitExample;
  protected readonly _predefinedFunctionsExample = PredefinedFunctionsExample;
  protected readonly _predefinedFunctionsTemplateExample = PredefinedFunctionsTemplateExample;
  protected readonly _fallbackInputCode = FallbackInputCode;

  protected readonly _bannerImg = HubAppImages.Blog.ProgImgsTutorial.placeholder;


  protected _showDemo = signal(false);
  protected _showButton = signal(false)

  protected readonly _githubRepo = BlogConstants.ProgImgTutorial.GitHubRepo;
  protected readonly _npmPkgUrl = BlogConstants.ProgImgTutorial.NpmPackage;

  // Create a transition ID for the component based on the current route
  protected _transitionId = computed(() => this._router.url);

  //----------------------------//


  protected _dlClick$ = new Subject<void>()
  private _dlState = MiniStateBuilder.CreateWithObservableInput(
    this._dlClick$,
    () => this._codeSampleDownloader.download$(HubAppDownloads.ProgImgTutorial.CodeSampleZipFile, HubAppDownloads.ProgImgTutorial.CodeSampleZipFile))
    .setSuccessMsgFn(() => '✅ Download complete!')

  protected _errorMsg = this._dlState.error
  protected _successMsg = this._dlState.successMsg
  protected _dlResult = this._dlState.data
  protected _isLoading = this._dlState.loading

  //----------------------------//

  ngOnInit() {

    setTimeout(() =>
      this._showButton.set(true),
      2000
    )

    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Progressive Images', 'Image Loading', 'Performance', 'User Experience'],
    });

    // Access static data from route
    const routeData = this._route.snapshot.data;
    if (routeData['showDemo']) {
      setTimeout(
        () => this._showDemo.set(true),
        1000
      )
    }

  }


} //Cls
