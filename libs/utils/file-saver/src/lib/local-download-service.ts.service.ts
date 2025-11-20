import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { devConsole } from '@spider-baby/dev-console';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { FileDownloadService } from './blob-download.service';

@Injectable({
  providedIn: 'root'
})
export class LocalFileDownloadServiceService {

  private _downloadService = inject(FileDownloadService);
  private _http = inject(HttpClient);

  //-----------------------------//

  //Current download file path
  private _activeDownload = new BehaviorSubject<string | null>(null);
  readonly activeDownload$ = this._activeDownload.asObservable();
  readonly activeDownload = toSignal(this.activeDownload$);


  private _errorBs = new BehaviorSubject<string | null>(null);
  readonly error$ = this._errorBs.asObservable();
  readonly error = toSignal(this.error$);

  //-----------------------------//

  /**
   * Downloads a binary file (like ZIP) from the server
   * @param filenameFullPath The name of the file to download
   * @param downloadName The name to use for the downloaded file
   * @param mimeType The MIME type of the file
   * @returns Observable that completes when download is finished
   */
  download$(
    filenameFullPath: string,
    downloadName: string = 'data.zip',
    mimeType: string = 'application/zip'): Observable<boolean> {

    this._activeDownload.next(filenameFullPath);

    console.log('TESTING FILE DOWNLOAD', filenameFullPath);
    console.log('activeDownload', this.activeDownload());


    return this._http
      .get(filenameFullPath, {
        responseType: 'blob',
        observe: 'response'
      })
      .pipe(
        map((response: HttpResponse<Blob>) => {

          const contentType = response.headers.get('Content-Type');

          console.log('@TESTING: response.ok', response.ok,);
          console.log('@TESTING: contentType', contentType);
          console.log('@TESTING: response.body', response.body);

          if (response.ok && response.body && contentType) {
            this.handleSuccess(response.body, downloadName, mimeType);
            return true
          } else {
            this.handleError(response, filenameFullPath, mimeType);
            throw new Error(`Error downloading binary file ${filenameFullPath}: ${response.status} - ${response.statusText}`);
          }
        }),
        catchError(error => {
          // Handle network errors and other HTTP errors
          const errorMsg = `Network error downloading file ${filenameFullPath}: ${error.message || 'Unknown error'}`;
          devConsole.error(errorMsg);
          
          // Reset download status
          this._activeDownload.next(null);
          
          // Set error message
          this._errorBs.next(errorMsg);
          
          // Re-throw the error so subscribers can handle it
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  //-----------------------------//


  private handleError(response: HttpResponse<Blob>, filename: string, mimeType: string): void {

    devConsole.log(`Error downloading binary file ${filename}:`, response);
    const contentType = response.headers.get('Content-Type');
    const errorMsg = `Failed to download file ${filename}. Status: ${response.status} - ${response.statusText}. 
      Expected MIME type: ${mimeType}, Got: ${contentType}`
    devConsole.error(errorMsg);

    this._activeDownload.next(null);
    this._errorBs.next(errorMsg);

  }

  //- - - - - - - - - - - - - - -//

  private handleSuccess(blob: Blob, downloadName: string, mimeType: string): void {
console.log('downloadName', downloadName);

    const options = { filename: downloadName, mimeType };
    this._downloadService.downloadBlob(blob, options);
    this._activeDownload.next(null);

  }


} //Cls