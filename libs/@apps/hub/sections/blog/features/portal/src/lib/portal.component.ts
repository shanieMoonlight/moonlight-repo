import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, TemplateRef, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HubAppDownloads } from '@sb-hub/core-config/downloads';
import { HubAppImages } from '@sb-hub/core-config/images';
import { SbHubPkgLinksComponent } from '@sb-hub/shared-ui/pkg-links';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';

// Import code samples
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { LocalFileDownloadServiceService } from '@spider-baby/utils-file-saver';
import { SbPortalInputComponent, SbPortalOutletComponent } from '@spider-baby/utils-portal';
import { Subject } from 'rxjs';

// Import tutorial code samples
import { AdvancedPatternsCode, ConditionalPortalDirectiveCode, PortalManagerServiceCode } from './code/advanced-patterns';
import { BasicUsageExample, ComplexComponentExample, ConditionalPortalExample, DynamicContentExample, MultiplePortalsExample } from './code/html-examples';
import { PortalBridgeServiceCode } from './code/portal-bridge-service';
import { PortalConstantsCode } from './code/portal-constants';
import { PortalInputComponentCode } from './code/portal-input-component';
import { PortalOutletComponentCode } from './code/portal-outlet-component';
import { BlogConstants } from './config/constants';
import { HubUiBtnDownloadComponent } from '@sb-hub/sections-blog/ui-buttons/downlaod';
import { Portal, TemplatePortal } from '@angular/cdk/portal';
import { SbHubBlogPortalConditionalDemoComponent } from './demo/conditional-demo.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatEverythingModule,
    RouterModule,
    HighlightModule,
    HubHeroBanner2Component,
    SbPortalInputComponent,
    SbPortalOutletComponent,
    SbHubPkgLinksComponent,
    HubUiBtnDownloadComponent,
    NgTemplateOutlet,
    SbHubBlogPortalConditionalDemoComponent
  ],
  providers: [LocalFileDownloadServiceService],
  selector: 'sb-hub-blog-features-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubBlogPortalComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _codeSampleDownloader = inject(LocalFileDownloadServiceService);

  //- - - - - - - - - - - - - - -//

  // Title and SEO properties
  protected _title = BlogConstants.PortalTutorial.Title;
  protected _subtitle = BlogConstants.PortalTutorial.Subtitle;
  protected _description = BlogConstants.PortalTutorial.Description;
  // Code samples for displaying in the tutorial
  protected readonly _portalConstantsCode = PortalConstantsCode;
  protected readonly _portalBridgeServiceCode = PortalBridgeServiceCode;
  protected readonly _portalInputComponentCode = PortalInputComponentCode;
  protected readonly _portalOutletComponentCode = PortalOutletComponentCode;

  // HTML examples
  protected readonly _basicUsageExample = BasicUsageExample;
  protected readonly _multiplePortalsExample = MultiplePortalsExample;
  protected readonly _conditionalPortalExample = ConditionalPortalExample;
  protected readonly _dynamicContentExample = DynamicContentExample;
  protected readonly _complexComponentExample = ComplexComponentExample;
  // Advanced patterns
  protected readonly _advancedPatternsCode = AdvancedPatternsCode;
  protected readonly _portalManagerServiceCode = PortalManagerServiceCode;
  protected readonly _conditionalPortalDirectiveCode = ConditionalPortalDirectiveCode;

  protected readonly _bannerImg = HubAppImages.Blog.PortalTutorial.placeholder;

  protected _showDemo = signal(false);
  protected _showButton = signal(false);
  protected readonly _gitHubRepoUrl = BlogConstants.PortalTutorial.GitHubRepo;
  protected readonly _npmPackageUrl = BlogConstants.PortalTutorial.NpmPackage;

  // Create a transition ID for the component based on the current route
  protected _transitionId = computed(() => this._router.url);

  //----------------------------//

  protected _dlClick$ = new Subject<void>();
  private _dlState = MiniStateBuilder.CreateWithObservableInput(
    this._dlClick$,
    () => this._codeSampleDownloader.download$(HubAppDownloads.PortalTutorial.CodeSampleZipFile, 'portal-tutorial-code-samples.zip'))
    .setSuccessMsgFn(() => '✅ Download complete!');

  protected _errorMsg = this._dlState.error;
  protected _successMsg = this._dlState.successMsg;
  protected _dlResult = this._dlState.data;
  protected _isLoading = this._dlState.loading;

  protected showDialog = false

  // private _viewContainerRef = inject(ViewContainerRef);
  protected _selectedPortal?: TemplateRef<unknown>
  demoTemplate1 = viewChild.required<TemplateRef<unknown>>('demoPortalTemplate1');
  demoTemplate2 = viewChild.required<TemplateRef<unknown>>('demoPortalTemplate2');

  showTemplate1(){
    this._selectedPortal = this.demoTemplate1()
  }
  showTemplate2(){
    this._selectedPortal =  this.demoTemplate2()
  }


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
      keywords: ['Angular', 'CDK', 'Portal', 'Component', 'Tutorial', 'TypeScript', 'UI Library'],
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
