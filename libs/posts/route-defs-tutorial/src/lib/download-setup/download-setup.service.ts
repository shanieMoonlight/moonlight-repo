import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BlobDownloadService } from '@spider-baby/utils-file-saver';
import { RouteUtility } from '@spider-baby/utils-routes';
import { BehaviorSubject, Observable, catchError, delay, map, of } from 'rxjs';
import { AppConstants } from '../config/constants';


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


  private _errorBs = new BehaviorSubject<string | null>(null);
  readonly error$ = this._errorBs.asObservable();
  readonly error = toSignal(this.error$);

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
        observe: 'response' // Observe the full HttpResponse object
      })
      .pipe(
        delay(500),
        map((response: HttpResponse<Blob>) => {
          const contentType = response.headers.get('Content-Type');

          if (response.ok && response.body && contentType && contentType.toLowerCase().startsWith(mimeType.toLowerCase())) {            
            this.handleSuccess(response.body, downloadName, mimeType);
            this._activeDownload.next(null)
            return true            
          } else {          
            this.handleError(response, filename, mimeType);
            return false
          }

        }),
        catchError((error) => {
          console.error(`Error downloading binary file ${filename}:`, error);
          this._activeDownload.next(null)
          return of(false);
        })
      );
  }

  //-----------------------------//

  private handleError(response: HttpResponse<Blob>, filename: string, mimeType: string): void {
    
    const contentType = response.headers.get('Content-Type');
    // Handle cases where response is not OK, body is missing, or content type doesn't match
    const errorMsg = `Failed to download file ${filename}. Status: ${response.status} - ${response.statusText}. 
      Expected MIME type: ${mimeType}, Got: ${contentType}`
    console.error(errorMsg);
    this._activeDownload.next(null);
    this._errorBs.next(errorMsg);

  }

  //- - - - - - - - - - - - - - -//

  private handleSuccess(blob: Blob, downloadName: string,  mimeType: string): void {

    const options = { filename: downloadName, mimeType };
    this._downloadService.downloadBlob(blob, options);
    this._activeDownload.next(null);

  }

  //-----------------------------//

} //Cls
