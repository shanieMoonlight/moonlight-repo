import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';
import { UrlUtilsService } from './url.service';

//################################################//

/**
 * Structure for a meta tag with name or property attribute
 */
type MetaTag = {
    name?: string;
    property?: string;
    content: string;
};

/**
 * Options for updating metadata in the document head
 */
interface MetaDataOptions {
    /** Page title (defaults to app name from config) */
    title?: string
    /** Page description (defaults to app description from config) */
    description?: string
    /** Image URL for social sharing (defaults to logo from config) */
    image?: string
    /** Canonical URL for the page (defaults to base URL from config) */
    url?: string
}

//################################################//

/**
 * Service for managing SEO-related metadata including page titles,
 * meta descriptions, Open Graph tags, and canonical links.
 * 
 * This service helps improve search engine discoverability and social
 * media sharing appearance for Angular applications.
 */
@Injectable({
    providedIn: 'root'
})
export class SeoService {

    private _document = inject(DOCUMENT)
    private _meta = inject(Meta)
    private _title = inject(Title)
    private _config: SeoConfig = inject(SeoConfigService)
    private _urlService = inject(UrlUtilsService);

    //-----------------------------//

    /**
     * Updates the document metadata for SEO and social sharing
     * 
     * @param options - Metadata options to update (title, description, image, url)
     * If any option is omitted, it will use the default from SeoConfig
     */
    updateMetadata(options: MetaDataOptions = {}) {
        
        const title = options.title ?? this._config.appName
        const description = options.description ?? this._config.appDescription;
        const image = options.image ?? this._config.defaultLogoFilePath;
        const ogImage = options.image ?? this._config.defaultOgImageUrl;
        const url = options.url ?? this._config.baseUrl;
        

        // Set title
        this._title.setTitle(title)


        // Set meta tags
        const tags: MetaTag[] = [
            { name: 'description', content: description },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: url },
            { property: 'og:image', content: ogImage },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: image },
            { name: 'keywords', content: this._config.keywords.join(', ') || 'SpiderBaby Angular' },
        ]

        console.log('tags', tags);
        

        // Update each meta tag
        tags.forEach(tag => {
            // For name-based meta tags
            if (tag.name)
                this._meta.updateTag({ name: tag.name, content: tag.content });
            // For property-based meta tags (Open Graph, etc.)
            else if (tag.property)
                this._meta.updateTag({ property: tag.property, content: tag.content });
        })
    }

    //-----------------------------//

     /**
     * Adds or updates the canonical link using a relative path.
     * Combines the relative path with the baseUrl from SeoConfig.
     * @param relativePath - The relative path (e.g., from router.url)
     */
     addCanonicalLinkRelative(relativePath: string) {
        console.log('addCanonicalLinkRelative', relativePath);
        
        // Use the combineUrl logic (assuming it's available)
        // and the baseUrl from the injected config
        const absoluteUrl = this._urlService.combineWithBase(relativePath);
        this.addCanonicalLink(absoluteUrl); // Call the original method
    }

    //-----------------------------//

    /**
     * Adds or updates the canonical link in the document head
     * 
     * Canonical links help prevent duplicate content issues by indicating
     * the preferred URL for a page when multiple URLs might contain the same content.
     * 
     * @param url - The canonical URL for the current page
     */
    addCanonicalLink(url: string) {
        const link: HTMLLinkElement = this._document.querySelector('link[rel="canonical"]') || this._document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);

        const head = this._document.querySelector('head');
        console.log('head', head)
        // Check if head element exists before appending the link;
        
        if (head) {
            // Remove existing canonical if it exists
            const existingLink = head.querySelector('link[rel="canonical"]');
            if (existingLink)
                existingLink.remove();

            head.appendChild(link);
        }
    }

}//Cls