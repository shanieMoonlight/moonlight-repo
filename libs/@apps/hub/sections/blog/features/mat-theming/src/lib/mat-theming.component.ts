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
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';

// Import code examples
import { 
  InstallationExample, 
  BasicSetupExample, 
  BasicThemeServiceExample, 
  CustomThemeExample 
} from './code/basic-examples';
import { 
  DynamicThemeConfigExample, 
  ThemeGeneratorExample, 
  HierarchicalThemingExample, 
  ScssExportExample,
  ThemeTransitionsExample 
} from './code/advanced-examples';
import { 
  MaterialDesign3Example, 
  ComponentIntegrationExample, 
  CompleteSetupExample 
} from './code/integration-examples';

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
  selector: 'sb-hub-blog-features-mat-theming',
  templateUrl: './mat-theming.component.html',
  styleUrl: './mat-theming.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogMatThemingComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _codeSampleDownloader = inject(LocalFileDownloadServiceService);

  //- - - - - - - - - - - - - - -//

  // Title and SEO properties
  protected _title = BlogConstants.MatThemingTutorial.Title;
  protected _subtitle = BlogConstants.MatThemingTutorial.Subtitle;
  protected _description = BlogConstants.MatThemingTutorial.Description;

  //- - - - - - - - - - - - - - -//

  // Basic examples
  protected readonly _installationExample = InstallationExample;
  protected readonly _basicSetupExample = BasicSetupExample;
  protected readonly _basicThemeServiceExample = BasicThemeServiceExample;
  protected readonly _customThemeExample = CustomThemeExample;
  
  // Advanced examples
  protected readonly _dynamicThemeConfigExample = DynamicThemeConfigExample;
  protected readonly _themeGeneratorExample = ThemeGeneratorExample;
  protected readonly _hierarchicalThemingExample = HierarchicalThemingExample;
  protected readonly _scssExportExample = ScssExportExample;
  protected readonly _themeTransitionsExample = ThemeTransitionsExample;
  
  // Integration examples
  protected readonly _materialDesign3Example = MaterialDesign3Example;
  protected readonly _componentIntegrationExample = ComponentIntegrationExample;
  protected readonly _completeSetupExample = CompleteSetupExample;

  //- - - - - - - - - - - - - - -//

  protected readonly _bannerImg = HubAppImages.Blog.MatThemingTutorial.placeholder || '';

  protected _showDemo = signal(false);
  protected _showButton = signal(false);
  protected readonly _gitHubRepoUrl = BlogConstants.MatThemingTutorial.GitHubRepo;
  protected readonly _npmPackageUrl = BlogConstants.MatThemingTutorial.NpmPackage;

  // Create a transition ID for the component based on the current route
  protected _transitionId = computed(() => this._router.url);

  //----------------------------//

  protected _dlClick$ = new Subject<void>();
  private _dlState = MiniStateBuilder.CreateWithObservableInput(
    this._dlClick$,
    () => this._codeSampleDownloader.download$(HubAppDownloads.MatThemingTutorial?.CodeSampleZipFile || '', 'mat-theming-tutorial-code-samples.zip'))
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
      keywords: ['Angular', 'Material Design 3', 'Theming', 'Dark Mode', 'CSS Variables', 'Dynamic Themes', 'Custom Themes', 'Material UI', 'TypeScript', 'Tutorial'],
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
