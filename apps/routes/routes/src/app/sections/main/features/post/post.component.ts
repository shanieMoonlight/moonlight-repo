import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HighlightModule } from 'ngx-highlightjs';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AppConstants } from '../../../../config/constants';
import { AppImages, AppImages1 } from '../../../../config/images';
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
    CommonModule,
    AppStructureDiagramComponent,
    HighlightModule,
  ],
  host: { ngSkipHydration: 'true' },
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {

  private _codeSampleDownloader = inject(DownloadCodeSampleService);

  //----------------------------//

  protected _homeRoute = AppRouteDefs.fullPathsWithSlash.main.route();

  protected _simpleAppRoutesWitRoutesTypeCode = SimpleAppRoutesWitRoutesTypeCode
  protected _subSetionRouteDefsCode = ProdAdminSubSetionRouteDefsCode
  protected _adminSubSetionRouteDefsCode = AdminSubSetionRouteDefsCode
  protected _routeUtilsCode = RouteUtilsCode
  protected _appRouteDefsCode = AppRouteDefsCode
  protected _appRouteUsageCode = AppRoutesExamplesTs


  protected readonly _codeSamplesZip = AppConstants.Downloads.CodeSampleZipFile
  protected readonly _bannerImg = AppImages.Post.Banner.xlarge

  protected _isDownloading = this._codeSampleDownloader.activeDownload

  protected _showButton = signal(false)


  constructor() {

    console.log(`AppRouteDefs.routes.admin.products.route()`, AppRouteDefs.routes.admin.products.route());
    console.log(`AppRouteDefs.fullPaths.admin.products.route()`, AppRouteDefs.fullPaths.admin.products.route());
    console.log(`AppRouteDefs.fullPathsWithSlash.admin.products.route()`, AppRouteDefs.fullPathsWithSlash.admin.products.route());


  }

  //----------------------------//

  ngOnInit() {
    setTimeout(() => {
      this._showButton.set(true);
    }, 1000); 
  }


  //----------------------------//

  protected downloadCodeSamples() {
    this._codeSampleDownloader.downloadBinary(this._codeSamplesZip, this._codeSamplesZip)
      .subscribe((result) => {
        console.log('Download result:', result);
      });
  }



}
