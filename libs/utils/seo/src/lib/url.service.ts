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


    //-----------------------------//

    /**
     * Resolves a potentially relative path or absolute URL to a guaranteed absolute URL.
     * If the input is absolute, it's returned directly.
     * If the input is relative, it's combined with the base URL.
     * If no input is provided, the base URL is returned.
     * @param pathOrUrl Optional relative path or absolute URL string.
     * @returns The guaranteed absolute URL.
     */
    resolveAbsoluteUrl(pathOrUrl?: string): string {
        if (pathOrUrl) {// Check if the provided URL is already absolute            
            return pathOrUrl.startsWith('http') 
                ? pathOrUrl 
                : this.combineWithBase(pathOrUrl);
        } else {// Default to the base URL if no specific URL is provided            
            return this._config.baseUrl;
        }
    }

}