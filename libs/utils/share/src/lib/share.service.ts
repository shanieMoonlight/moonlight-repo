
import { inject, Injectable, DOCUMENT } from '@angular/core';

//##############################################//

export interface ShareResult {
  success: boolean;
  method: 'webshare' | 'clipboard' | 'none';
  error?: Error;
}

//##############################################//

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private _document = inject(DOCUMENT);

  //-----------------------------//

  /**
   * Attempts to share the current page using Web Share API
   * or falls back to clipboard copy
   * @returns Promise with ShareResult indicating success/failure and method used
   */
  async shareCurrentPage(customTitle?: string, customText?: string): Promise<ShareResult> {
    const url = this._document.location.href;
    const title = customTitle || this._document.title || 'Mat Theming Demo';
    const text = customText || 'Check out this Material theme demo:';
    
    try {
      // Try Web Share API first if available
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return { success: true, method: 'webshare' };
      }
      
      // Fall back to clipboard if Web Share API is not available
      return await this.copyToClipboard(url);
      
    } catch (error) {
      // If user cancelled sharing (AbortError), don't treat as error
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, method: 'webshare', error: error };
      }
      
      // For other errors with Web Share API, try clipboard as fallback
      try {
        return await this.copyToClipboard(url);
      } catch (clipboardError) {
        return { 
          success: false, 
          method: 'none', 
          error: clipboardError instanceof Error ? clipboardError : new Error(String(clipboardError)) 
        };
      }
    }
  }

  //-----------------------------//

  /**
   * Copies the provided text to clipboard
   * @returns Promise with ShareResult indicating success/failure
   */
  async copyToClipboard(textToCopy: string): Promise<ShareResult> {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      
      await navigator.clipboard.writeText(textToCopy);
      return { success: true, method: 'clipboard' };
    } catch (error) {
      return { 
        success: false, 
        method: 'none', 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  }

}//Cls