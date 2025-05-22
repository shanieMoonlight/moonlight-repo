import { Injectable } from '@angular/core';

//############################################//

export interface DownloadOptions {
  filename: string;
  mimeType: string;
}

//############################################//

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  /**
   * Triggers a file download from any content
   * @param content The content to download
   * @param options Download options (filename and MIME type)
   * @returns True if download was initiated successfully
   */
  downloadBlob(content: string | Blob, options: DownloadOptions): boolean {
    try {
      const blob =
        content instanceof Blob
          ? content
          : new Blob([content], { type: options.mimeType });

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
  downloadScss(content: string, filename = 'page.scss'): boolean {
    // Ensure filename has .scss extension
    if (!filename.toLowerCase().endsWith('.scss')) filename += '.scss';

    return this.downloadBlob(content, {
      filename,
      mimeType: 'text/scss',
    });
  }

  //----------------------------------//

  // Convenience method for JSON downloads
  downloadJson(content: object | string, filename = 'data.json'): boolean {
    // Convert object to string if needed
    const jsonContent =
      typeof content === 'string' ? content : JSON.stringify(content, null, 2);

    // Ensure filename has .json extension
    if (!filename.toLowerCase().endsWith('.json')) filename += '.json';

    return this.downloadBlob(jsonContent, {
      filename,
      mimeType: 'application/json',
    });
  }

  //----------------------------------//

  // Convenience method for CSV downloads
  downloadCsv(content: string, filename = 'data.csv'): boolean {
    // Ensure filename has .csv extension
    if (!filename.toLowerCase().endsWith('.csv')) filename += '.csv';

    return this.downloadBlob(content, {
      filename,
      mimeType: 'text/csv',
    });
  }

  //----------------------------------//

  // Convenience method for Text downloads
  downloadText(content: string, filename = 'data.txt'): boolean {
    // Ensure filename has .txt extension
    if (!filename.toLowerCase().endsWith('.txt')) filename += '.txt';

    return this.downloadBlob(content, {
      filename,
      mimeType: 'text/plain',
    });
  }

  //----------------------------------//

  // Convenience method for HTML downloads
  downloadHtml(content: string, filename = 'page.html'): boolean {
    // Ensure filename has .html extension
    if (
      !filename.toLowerCase().endsWith('.html') &&
      !filename.toLowerCase().endsWith('.htm')
    )
      filename += '.html';

    return this.downloadBlob(content, {
      filename,
      mimeType: 'text/html',
    });
  }

  //----------------------------------//
} //Cls
