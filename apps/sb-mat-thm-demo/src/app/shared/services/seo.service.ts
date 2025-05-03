import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppConstants } from '../../config/constants';

//################################################//

type MetaTag = {
    name?: string;
    property?: string;
    content: string;
};

//################################################//


@Injectable({
    providedIn: 'root'
})
export class SeoService {

    private _document = inject(DOCUMENT)
    private _meta = inject(Meta)
    private _title = inject(Title)

    //-----------------------------//

    updateMetadata({
        title = 'SpiderBaby Material Theming',
        description = 'A powerful, flexible theming system for Angular Material with dynamic theme switching, section-based theming, and Material Design 3 support.',
        image = '/images/og-image.jpg',
        url = AppConstants.DEMO_URL,
    } = {}) {
        // Set title
        this._title.setTitle(title);

        // Set meta tags
        const tags: MetaTag[] = [
            { name: 'description', content: description },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: url },
            { property: 'og:image', content: image },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: image },
            { name: 'keywords', content: 'Angular Material, Material Design, theming, CSS variables, dark mode, theme customization, Angular library' },
        ];

        // Update each meta tag
        tags.forEach(tag => {
            // For name-based meta tags
            if (tag.name)
                this._meta.updateTag({ name: tag.name, content: tag.content });
            // For property-based meta tags (Open Graph, etc.)
            else if (tag.property)
                this._meta.updateTag({ property: tag.property, content: tag.content });
        });
    }

    //-----------------------------//

    addCanonicalLink(url: string) {
        console.log('Adding canonical link:', url);
        
        const link: HTMLLinkElement = this._document.querySelector('link[rel="canonical"]') || this._document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);

        const head = this._document.querySelector('head');
        if (head) {
            // Remove existing canonical if it exists
            const existingLink = head.querySelector('link[rel="canonical"]');
            if (existingLink)
                existingLink.remove();

            head.appendChild(link);
        }
    }

}//Cls