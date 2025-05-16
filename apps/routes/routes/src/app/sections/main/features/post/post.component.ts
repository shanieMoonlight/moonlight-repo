import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HighlightModule } from 'ngx-highlightjs';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AppConstants } from '../../../../config/constants';
import { AppImages1 } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { AdminSubSetionRouteDefsCode } from './code/admin-sub-section';
import { AppRouteDefsCode } from './code/app-route-defs';
import { ProdAdminSubSetionRouteDefsCode } from './code/prod-admin-sub-section';
import { RouteUtilsCode } from './code/route-utils';
import { SimpleAppRoutesWitRoutesTypeCode } from './code/simple-routes-with-types';
import { AppRoutesExamplesTs } from './code/using-app-route-defs';
import { DownloadCodeSampleService } from './download-setup/download-setup.service';
import { AppStructureDiagramComponent } from './ui/app-structure/app-structure-diagram.component';

@Component({
  selector: 'rd-post',
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent,
    CommonModule,
    AppStructureDiagramComponent,
    HighlightModule,
  ],
  host: {ngSkipHydration: 'true'},
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {

  private _codeSampleDownloader = inject(DownloadCodeSampleService);


  protected _title = 'Contact us'; protected _subtitle = 'Get in touch with our team';
  protected _description = `Have questions or need assistance? Our dedicated support team is here to help. Fill out the contact form below or reach out to us directly using the information provided.`;
  protected _heroImageUrl = AppImages1.Logo.small;
  protected _heroImageAlt = 'Route Defs Demo Logo';


  protected _homeRoute = AppRouteDefs.fullPathsWithSlash.main.route();

  protected _simpleAppRoutesWitRoutesTypeCode = SimpleAppRoutesWitRoutesTypeCode
  protected _subSetionRouteDefsCode = ProdAdminSubSetionRouteDefsCode
  protected _adminSubSetionRouteDefsCode = AdminSubSetionRouteDefsCode
  protected _routeUtilsCode = RouteUtilsCode
  protected _appRouteDefsCode = AppRouteDefsCode
  protected _appRouteUsageCode = AppRoutesExamplesTs


  protected readonly codeSamplesZip = AppConstants.Downloads.CodeSampleZipFile

  // protected _setupFiles = this._setupFilesService.setupFiles
  // // protected _downloadingFile = this._setupFilesService.downloadingFile
  // protected _downloadingFile = this._setupFilesService.activeDownload

  // protected _downloadFileClick$ = new Subject<SetupFile>();
  // protected _activeFile$ = this._downloadFileClick$.pipe(
  //   switchMap((file) => this._setupFilesService.downloadPredefinedFile(file))
  // )
  // protected _activeFile = toSignal(this._activeFile$, { initialValue: null })
  protected _isDownloading =this._codeSampleDownloader.activeDownload

  constructor() {

    console.log(`AppRouteDefs.routes.admin.products.route()`, AppRouteDefs.routes.admin.products.route());
    console.log(`AppRouteDefs.fullPaths.admin.products.route()`, AppRouteDefs.fullPaths.admin.products.route());
    console.log(`AppRouteDefs.fullPathsWithSlash.admin.products.route()`, AppRouteDefs.fullPathsWithSlash.admin.products.route());


  }

  protected downloadCodeSamples() {
    this._codeSampleDownloader.downloadBinary(this.codeSamplesZip, this.codeSamplesZip)
    this._codeSampleDownloader.downloadBinary('tester.txt', 'tester.txt')
      .subscribe((result) => {
        console.log('Download result:', result);
      });
  }



}
