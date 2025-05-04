import { inject, Injectable } from '@angular/core';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';

@Injectable({
    providedIn: 'root'
})
export class UrlUtilsService {

    private _config: SeoConfig = inject(SeoConfigService)

    //-----------------------------//

    /**
     * Safely combines any two URL parts
     * @param base The base URL part
     * @param path The path to append
     * @returns The combined URL
     */
    combine(base: string, path?: string): string {
        
        if (!path) {
            return base;
        }

        // Ensure base ends with a slash if it's not empty
        const baseWithSlash = base.endsWith('/') ? base : `${base}/`;

        // Ensure path doesn't start with a slash to avoid double slashes
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;

        return `${baseWithSlash}${cleanPath}`;
    }


        /**
     * Combines the app's base URL with a relative path
     * @param path The relative path to combine with the base URL
     * @returns The complete URL
     */
        combineWithBase = (path?: string): string =>
            this.combine(this._config.baseUrl, path)

}