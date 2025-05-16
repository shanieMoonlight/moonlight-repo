import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BlobDownloadService } from '@spider-baby/utils-file-saver';
import { AppConstants } from '../../../../../config/constants';
import { BehaviorSubject, Observable, catchError, delay, map, of } from 'rxjs';
import path from 'path';
import { RouteUtility } from '@spider-baby/utils-routes';


@Injectable({
  providedIn: 'root',
})
export class DownloadCodeSampleService {

  private _downloadService = inject(BlobDownloadService);
  private _http = inject(HttpClient);

  //-----------------------------//

  // Setup file paths
  private _setupFilesBasePath = AppConstants.Downloads.Dir;

  // Pre-defined setup files available for download
  private _activeDownload = new BehaviorSubject<string | null>(null);
  readonly activeDownload$ = this._activeDownload.asObservable();
  readonly activeDownload = toSignal(this.activeDownload$);

  //-----------------------------//

  /**
   * Downloads a binary file (like ZIP) from the server
   * @param filename The name of the file to download
   * @param downloadName The name to use for the downloaded file
   * @param mimeType The MIME type of the file
   * @returns Observable that completes when download is finished
   */
  downloadBinary(
    filename: string = 'code-samples.zip',
    downloadName: string = 'code-samples.zip',
    mimeType: string = 'application/zip'): Observable<boolean> {
    this._activeDownload.next(filename);

    const filePath = RouteUtility.combine(this._setupFilesBasePath, filename);
    return this._http
      .get(filePath, {
        responseType: 'blob',
      })
      .pipe(
        delay(1000),
        map((blobContent) => {
          const options = { filename: downloadName, mimeType }
          this._downloadService.downloadBlob(blobContent, options);
          this._activeDownload.next(null)
          return true;
        }),
        catchError((error) => {
          console.error(`Error downloading binary file ${filename}:`, error);
          this._activeDownload.next(null)
          return of(false);
        })
      );
  }

  //-----------------------------//

} //Cls
