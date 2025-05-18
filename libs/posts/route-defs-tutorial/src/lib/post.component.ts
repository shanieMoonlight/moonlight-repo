import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HighlightModule } from 'ngx-highlightjs';
import { AdminSubSetionRouteDefsCode } from './code/admin-sub-section';
import { AppRouteDefsCode } from './code/app-route-defs';
import { ProdAdminSubSetionRouteDefsCode } from './code/prod-admin-sub-section';
import { RouteUtilsCode } from './code/route-utils';
import { SimpleAppRoutesWitRoutesTypeCode } from './code/simple-routes-with-types';
import { AppRoutesExamplesTs } from './code/using-app-route-defs';
import { DownloadCodeSampleService } from './download-setup/download-setup.service';
import { AppStructureDiagramComponent } from './ui/app-structure/app-structure-diagram.component';
import { AppConstants } from './config/constants';
import { LibImages } from './config/images';
import {ErrorModalComponent} from '@spider-baby/mat-notifications/error';

@Component({
  selector: 'sb-post-route-defs-tutorial',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    CommonModule,
    AppStructureDiagramComponent,
    HighlightModule,
    ErrorModalComponent
  ],
  host: { ngSkipHydration: 'true' },
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostRouteDefsTutorialComponent implements OnInit {

  private _codeSampleDownloader = inject(DownloadCodeSampleService);

  //----------------------------//

  protected _simpleAppRoutesWitRoutesTypeCode = SimpleAppRoutesWitRoutesTypeCode
  protected _subSetionRouteDefsCode = ProdAdminSubSetionRouteDefsCode
  protected _adminSubSetionRouteDefsCode = AdminSubSetionRouteDefsCode
  protected _routeUtilsCode = RouteUtilsCode
  protected _appRouteDefsCode = AppRouteDefsCode
  protected _appRouteUsageCode = AppRoutesExamplesTs


  protected readonly _codeSamplesZip = AppConstants.Downloads.CodeSampleZipFile
  protected readonly _bannerImg = LibImages.Post.Banner.xlarge

  protected _isDownloading = this._codeSampleDownloader.activeDownload
  protected _errorMsg = this._codeSampleDownloader.error

  protected _showButton = signal(false)

  //----------------------------//

  ngOnInit() {
    setTimeout(() => {
      this._showButton.set(true);
    }, 1000); 
  }


  //----------------------------//

  
  protected downloadCodeSamples() {

    // this._codeSampleDownloader.downloadBinary('tester.txt', 'tester.txt', 'text/plain')
    this._codeSampleDownloader.downloadBinary(this._codeSamplesZip, this._codeSamplesZip)
      .subscribe((result) => {
        console.log('Download result:', result);
      });
  }


}//Cls
