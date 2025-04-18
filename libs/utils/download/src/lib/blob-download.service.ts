import { Injectable } from '@angular/core';

//############################################//

export interface DownloadOptions {
  filename: string;
  mimeType: string;
}

//############################################//

@Injectable({
  providedIn: 'root'
})
export class BlobDownloadService {

     /**
   * Triggers a file download from any content
   * @param content The content to download
   * @param options Download options (filename and MIME type)
   * @returns True if download was initiated successfully
   */
  downloadBlob(content: string | Blob, options: DownloadOptions): boolean {
    try {
      const blob = content instanceof Blob ? 
        content : 
        new Blob([content], { type: options.mimeType });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = options.filename;
      
      // More accessible approach
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  }

  //----------------------------------//

  // Convenience method for SCSS downloads
  downloadScss(content: string, filename = 'my-download.scss'): boolean {
    
    // Ensure filename has .scss extension
    if (!filename.toLowerCase().endsWith('.scss')) 
      filename += '.scss'

    return this.downloadBlob(content, {
      filename,
      mimeType: 'text/scss'
    });
  }

  //----------------------------------//

}
