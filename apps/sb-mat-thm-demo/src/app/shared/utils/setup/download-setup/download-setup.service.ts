import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FileDownloadService } from '@spider-baby/utils-file-saver';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';

//############################################//

export interface SetupFile {
  /** File name on the server */
  filename: string;
  /** Display name for the file when downloaded */
  displayName?: string;
  /** Title to show in the UI */
  title: string;
  /** Description of what the file contains */
  description: string;
  /** Optional icon to show with the download button */
  icon?: string;
  /** Is this a binary file (like ZIP)? */
  isBinary?: boolean;
}

//############################################//

const SETUP_FILES: SetupFile[] = [
  {
    filename: 'theme.config.ts',
    title: 'Theme Configuration',
    description: 'Basic theme configuration with sample themes',
    icon: 'palette',
  },
  {
    filename: 'material-theme.scss',
    title: 'SCSS Setup',
    description: 'Ready-to-use SCSS configuration for Material themes',
    icon: 'style',
  },
  {
    filename: 'app.config.ts',
    title: 'App Configuration',
    description: 'Configuration setup for Angular providers',
    icon: 'settings',
  },
  {
    filename: 'complete-setup.zip',
    displayName: 'sb-material-theming-setup.zip',
    title: 'Complete Setup Package',
    description: 'All configuration files in one download',
    icon: 'folder_zip',
    isBinary: true,
  },
];

//############################################//

@Injectable({
  providedIn: 'root',
})
export class DownloadSetupFilesService {
  private _downloadService = inject(FileDownloadService);
  private _http = inject(HttpClient);

  //-----------------------------//

  // Setup file paths
  private _setupFilesBasePath = '/setup-files/';

  // Pre-defined setup files available for download
  readonly setupFiles = signal(SETUP_FILES);
  private _activeDownload = new BehaviorSubject<string | null>(null);
  readonly activeDownload$ = this._activeDownload.asObservable();
  readonly activeDownload = toSignal(this.activeDownload$);

  //-----------------------------//

  /**
   * Downloads a setup file from the server
   * @param filename The name of the file to download
   * @param displayName Optional display name for the downloaded file
   * @param isBinary Whether the file is binary (like ZIP)
   * @returns Observable that completes when download is finished
   */
  downloadSetupFile(
    filename: string,
    displayName?: string,
    isBinary = false
  ): Observable<string | null> {
    this._activeDownload.next(filename);

    // Determine file type from extension for proper MIME type
    const extension = filename.split('.').pop()?.toLowerCase();
    let mimeType = 'text/plain';

    if (extension === 'ts') mimeType = 'application/typescript';
    else if (extension === 'json') mimeType = 'application/json';
    else if (extension === 'scss') mimeType = 'text/scss';
    else if (extension === 'zip') mimeType = 'application/zip';

    // Use the provided display name or the original filename
    const downloadName = displayName || filename;

    if (isBinary) {
      this.downloadBinary(filename, downloadName, mimeType).subscribe({
        error: () => this._activeDownload.next(null),
        complete: () => this._activeDownload.next(null),
      });
    } else {
      // Handle text files
      this.downloadStandard(filename, downloadName, mimeType).subscribe({
        error: () => this._activeDownload.next(null),
        complete: () => this._activeDownload.next(null),
      });
    }

    // Return the observable that tracks the download state
    return this.activeDownload$;
  }

  //-----------------------------//

  /**
   * Downloads a binary file (like ZIP) from the server
   * @param filename The name of the file to download
   * @param downloadName The name to use for the downloaded file
   * @param mimeType The MIME type of the file
   * @returns Observable that completes when download is finished
   */
  private downloadBinary(
    filename: string,
    downloadName: string,
    mimeType: string
  ): Observable<boolean> {
    return this._http
      .get(`${this._setupFilesBasePath}${filename}`, {
        responseType: 'blob',
      })
      .pipe(
        map((blobContent) => {
          this._downloadService.downloadBlob(blobContent, {
            filename: downloadName,
            mimeType,
          });
          return true;
        }),
        catchError((error) => {
          console.error(`Error downloading binary file ${filename}:`, error);
          return of(false);
        })
      );
  }

  //-----------------------------//

  /**
   * Downloads a binary file (like ZIP) from the server
   * @param filename The name of the file to download
   * @param downloadName The name to use for the downloaded file
   * @param mimeType The MIME type of the file
   * @returns Observable that completes when download is finished
   */
  private downloadStandard(
    filename: string,
    downloadName: string,
    mimeType: string
  ): Observable<boolean> {
    return this._http
      .get(`${this._setupFilesBasePath}${filename}`, {
        responseType: 'text',
      })
      .pipe(
        // delay(5000), // Optional delay for demo purposes
        map((textContent) => {
          this._downloadService.downloadBlob(textContent, {
            filename: downloadName,
            mimeType,
          });
          return true;
        }),
        catchError((error) => {
          console.error(`Error downloading text file ${filename}:`, error);
          return of(false);
        })
      );
  }

  //-----------------------------//

  /**
   * Downloads a setup file based on its predefined configuration
   * @param file The setup file configuration to download
   * @returns Observable that completes when download is finished
   */
  downloadPredefinedFile = (file: SetupFile): Observable<string | null> =>
    this.downloadSetupFile(
      file.filename,
      file.displayName,
      file.isBinary ?? false
    );

  //-----------------------------//
} //Cls
