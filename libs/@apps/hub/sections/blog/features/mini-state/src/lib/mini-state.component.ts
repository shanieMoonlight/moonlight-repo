import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HubAppDownloads } from '@sb-hub/core-config/downloads';
import { HubAppImages } from '@sb-hub/core-config/images';
import { SbHubPkgLinksComponent } from '@sb-hub/shared-ui/pkg-links';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';

// Import hero banner
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { LocalFileDownloadServiceService } from '@spider-baby/utils-file-saver';
import { SbPortalInputComponent } from '@spider-baby/utils-portal';
import { Subject } from 'rxjs';

// Import tutorial code samples
import { HubUiBtnDownloadComponent } from '@sb-hub/sections-blog/ui-buttons/downlaod';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';

// Import code examples
import { 
  BasicMiniStateExample, 
  MiniStateWithInputExample, 
  ReactiveMiniStateExample, 
  MiniCrudStateExample 
} from './code/mini-state-examples';
import { 
  CombinedStatesExample, 
  StateUtilityExample, 
  AdvancedConfigExample 
} from './code/advanced-examples';
import { 
  UserServiceExample, 
  InstallationExample, 
  ImportExample 
} from './code/service-examples';

import { BlogConstants } from './config/constants';

@Component({
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HighlightModule,
    HubHeroBanner2Component,
    SbPortalInputComponent,
    SbHubPkgLinksComponent,
    HubUiBtnDownloadComponent,
    SbMatNotificationsModalComponent
  ],
  providers: [LocalFileDownloadServiceService],
  selector: 'sb-hub-blog-features-mini-state',
  templateUrl: './mini-state.component.html',
  styleUrl: './mini-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogMiniStateComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _codeSampleDownloader = inject(LocalFileDownloadServiceService);

  //- - - - - - - - - - - - - - -//

  // Title and SEO properties
  protected _title = BlogConstants.MiniStateTutorial.Title;
  protected _subtitle = BlogConstants.MiniStateTutorial.Subtitle;
  protected _description = BlogConstants.MiniStateTutorial.Description;

  //- - - - - - - - - - - - - - -//

  // Code samples for displaying in the tutorial
  protected readonly _basicExample = BasicMiniStateExample;
  protected readonly _withInputExample = MiniStateWithInputExample;
  protected readonly _reactiveExample = ReactiveMiniStateExample;
  protected readonly _crudExample = MiniCrudStateExample;
  
  // Advanced examples
  protected readonly _combinedStatesExample = CombinedStatesExample;
  protected readonly _stateUtilityExample = StateUtilityExample;
  protected readonly _advancedConfigExample = AdvancedConfigExample;
  
  // Service and setup examples
  protected readonly _userServiceExample = UserServiceExample;
  protected readonly _installationExample = InstallationExample;
  protected readonly _importExample = ImportExample;

  //- - - - - - - - - - - - - - -//

  protected readonly _bannerImg = HubAppImages.Blog.MiniStateTutorial.placeholder || '';

  protected _showDemo = signal(false);
  protected _showButton = signal(false);
  protected readonly _gitHubRepoUrl = BlogConstants.MiniStateTutorial.GitHubRepo;
  protected readonly _npmPackageUrl = BlogConstants.MiniStateTutorial.NpmPackage;
  protected readonly _demoWebsiteUrl = BlogConstants.MiniStateTutorial.DemoWebsite;

  // Create a transition ID for the component based on the current route
  protected _transitionId = computed(() => this._router.url);

  //----------------------------//

  protected _dlClick$ = new Subject<void>();
  private _dlState = MiniStateBuilder.CreateWithObservableInput(
    this._dlClick$,
    () => this._codeSampleDownloader.download$(HubAppDownloads.MiniStateTutorial?.CodeSampleZipFile || '', 'mini-state-tutorial-code-samples.zip'))
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
      keywords: ['Angular', 'MiniState', 'State Management', 'Reactive', 'RxJS', 'Signals', 'Async', 'CRUD', 'Tutorial', 'TypeScript'],
    });

    // Access static data from route
    const routeData = this._route.snapshot.data;
    if (routeData['showDemo']) {
      setTimeout(
        () => this._showDemo.set(true),
        1000
      );
    }
  }

} //Cls
