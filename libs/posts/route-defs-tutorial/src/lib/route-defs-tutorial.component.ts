import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { devConsole } from '@spider-baby/dev-console';
import { SbMatNotificationsModalComponent } from '@spider-baby/mat-notifications';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { LocalFileDownloadServiceService } from '@spider-baby/utils-file-saver';
import { ProgImgLoaderFunctions, ProgressiveImageComponent } from '@spider-baby/utils-img/progressive';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';
import { Subject } from 'rxjs';
import { AdminSubSetionRouteDefsCode } from './code/admin-sub-section';
import { AppRouteDefsCode } from './code/app-route-defs';
import { ProdAdminSubSetionRouteDefsCode } from './code/prod-admin-sub-section';
import { RouteUtilsCode } from './code/route-utils';
import { SimpleAppRoutesWitRoutesTypeCode } from './code/simple-routes-with-types';
import { AppRoutesExamplesTs } from './code/using-app-route-defs';
import { AppConstants } from './config/constants';
import { LibImages } from './config/images';
import { AppStructureDiagramComponent } from './ui/app-structure/app-structure-diagram.component';
import { RouteUtility } from '@spider-baby/utils-routes';

@Component({
  selector: 'sb-post-route-defs-tutorial',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    CommonModule,
    AppStructureDiagramComponent,
    HighlightModule,
    SbMatNotificationsModalComponent,
    ProgressiveImageComponent
  ],
  providers: [LocalFileDownloadServiceService],
  host: { ngSkipHydration: 'true' },
  templateUrl: './route-defs-tutorial.component.html',
  styleUrl: './route-defs-tutorial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostRouteDefsTutorialComponent implements OnInit {

  private _codeSampleDownloader = inject(LocalFileDownloadServiceService);
  private _seoService = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  //- - - - - - - - - - - - - - //

  protected _simpleAppRoutesWitRoutesTypeCode = SimpleAppRoutesWitRoutesTypeCode
  protected _subSetionRouteDefsCode = ProdAdminSubSetionRouteDefsCode
  protected _adminSubSetionRouteDefsCode = AdminSubSetionRouteDefsCode
  protected _routeUtilsCode = RouteUtilsCode
  protected _appRouteDefsCode = AppRouteDefsCode
  protected _appRouteUsageCode = AppRoutesExamplesTs

  //- - - - - - - - - - - - - - //

  protected readonly _codeSamplesZip = RouteUtility.combine(
      AppConstants.Downloads.Dir, 
      AppConstants.Downloads.CodeSampleZipFile) 
      
  protected _showButton = signal(false)
  protected _showDemoLink = signal(false)
  protected _demoLink = 'https://spider-baby-route-defs.web.app/'

  // protected readonly _bannerImg = LibImages.Post.Banner.xlarge
  protected readonly _bannerPlaceholder = LibImages.Post.Banner.placeholder
  protected readonly _imgLoaderFn = ProgImgLoaderFunctions.replaceSegment('placeholder', 'xlarge')

  //- - - - - - - - - - - - - - //


  protected _dlClick$ = new Subject<void>()
  private _dlState = MiniStateBuilder.CreateWithObservableInput(
    this._dlClick$,
    () => this._codeSampleDownloader.download$(this._codeSamplesZip, this._codeSamplesZip))
    .setSuccessMsgFn(() => '✅ Download complete!')

  protected _errorMsg = this._dlState.error
  protected _successMsg = this._dlState.successMsg
  protected _dlResult = this._dlState.data
  protected _isLoading = this._dlState.loading


  _transitionId = computed(() => this.router.url);


  //----------------------------//

  ngOnInit() {

    setTimeout(() =>
      this._showButton.set(true),
      2000
    )

    this._seoService.updateMetadata({
      title: 'Spider-Baby | Route Definitions Tutorial',
      description: 'Learn how to define and manage routes in your Angular application using the Spider-Baby library.',
      image: LibImages.Post.Banner.medium,
    })


    // Access static data
    const staticData = this.route.snapshot.data;
    devConsole.log('Static data:', staticData);
    this._showDemoLink.set(staticData['showDemoLink']);

  }

  //----------------------------//

}//Cls
