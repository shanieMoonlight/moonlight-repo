import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { SeoConfig } from '@spider-baby/utils-seo/config';

//################################################//

/**
 * Base interface for all structured data schemas
 */
export interface StructuredDataSchema {
    '@context': 'https://schema.org';
    '@type': string;
  }

  //################################################//
  
  /**
   * Software Application schema type
   */
  export interface SoftwareApplicationSchema extends StructuredDataSchema {
    '@type': 'SoftwareApplication';
    name: string;
    applicationCategory: string;
    operatingSystem: string;
    offers?: {
      '@type': 'Offer';
      price: string;
      priceCurrency: string;
    };
    description: string;
    softwareVersion?: string;
    downloadUrl?: string;
    author?: {
      '@type': 'Person' | 'Organization';
      name: string;
      url?: string;
    };
  }

  //################################################//
  
  /**
   * Article schema type for documentation and blog posts
   */
  export interface ArticleSchema extends StructuredDataSchema {
    '@type': 'TechArticle' | 'Article';
    headline: string;
    description: string;
    author: {
      '@type': 'Person';
      name: string;
    };
    datePublished: string;
    dateModified?: string;
    publisher?: {
      '@type': 'Organization';
      name: string;
      logo?: {
        '@type': 'ImageObject';
        url: string;
      };
    };
    image?: string;
    mainEntityOfPage: string;
  }

  //################################################//
  
  /**
   * FAQ schema type for FAQ sections
   */
  export interface FAQPageSchema extends StructuredDataSchema {
    '@type': 'FAQPage';
    mainEntity: Array<{
      '@type': 'Question';
      name: string;
      acceptedAnswer: {
        '@type': 'Answer';
        text: string;
      };
    }>;
  }

  //################################################//
  
  /**
   * Code schema type for library modules and components
   */
  export interface CodeSchema extends StructuredDataSchema {
    '@type': 'SoftwareSourceCode';
    codeRepository: string;
    programmingLanguage: {
      '@type': 'ComputerLanguage';
      name: string;
    };
    targetProduct?: {
      '@type': 'SoftwareApplication';
      name: string;
    };
    description: string;
  }

  //################################################//
  
  /**
   * Organization schema type for company info
   */
  export interface OrganizationSchema extends StructuredDataSchema {
    '@type': 'Organization';
    name: string;
    url: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
  }


//################################################//

@Injectable({
    providedIn: 'root'
})
export class StructuredDataService {

    private document: Document = inject(DOCUMENT)
    private _config = inject(SeoConfig)

    //--------------------------------//

  /**
   * Adds structured data to the document
   * @param schema The structured data schema object
   * @param id Optional ID to identify this specific schema
   */
  addStructuredData(schema: StructuredDataSchema, id?: string): void {
    // If ID provided, remove any existing schema with the same ID
    if (id) {
      const existingScript = this.document.querySelector(`script[data-schema-id="${id}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    
    // Add data attribute if ID is provided
    if (id) {
      script.setAttribute('data-schema-id', id);
    }

    this.document.head.appendChild(script);
  }

  /**
   * Adds library application structured data
   */
  addLibraryStructuredData(): void {
    const librarySchema: SoftwareApplicationSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': this._config.appName,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
      },
      'description':this._config.appDescription,
      'softwareVersion': '1.0.0',
      'author': {
        '@type': 'Organization',
        'name': this._config.organization,
      }
    };

    this.addStructuredData(librarySchema, 'library-app');
  }

  /**
   * Adds documentation article structured data for a specific page
   * @param pageTitle Title of the current page
   * @param pageDescription Description of the current page
   * @param pageUrl Full URL of the current page
   */
  addDocumentationStructuredData(pageTitle: string, pageDescription: string, pageUrl: string): void {
    const articleSchema: ArticleSchema = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': pageTitle,
      'description': pageDescription,
      'author': {
        '@type': 'Person',
        'name': `${this._config.organization} Team`
      },
      'datePublished': this._config.publishedDate, // Update with actual publication date
      'dateModified': new Date().toISOString().split('T')[0], // Today's date for modified
      'publisher': {
        '@type': 'Organization',
        'name': this._config.organization,
        'logo': {
          '@type': 'ImageObject',
          'url': this._config.defaultLogoFilePath, // Update with actual logo URL
        }
      },
      'mainEntityOfPage': pageUrl
    };

    this.addStructuredData(articleSchema, 'documentation');
  }

  /**
   * Adds FAQ structured data for API documentation
   * @param faqs Array of question-answer pairs
   */
  addFAQStructuredData(faqs: Array<{question: string, answer: string}>): void {
    const faqSchema: FAQPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    this.addStructuredData(faqSchema, 'faqs');
  }

  /**
   * Adds code repository structured data for the open source library
   */
  addCodeRepositoryStructuredData(repoUrl: string): void {
    const codeSchema: CodeSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      'codeRepository': repoUrl,
      'programmingLanguage': {
        '@type': 'ComputerLanguage',
        'name': 'TypeScript'
      },
      'targetProduct': {
        '@type': 'SoftwareApplication',
        'name': 'Angular Applications'
      },
      'description': this._config.appDescription
    };

    this.addStructuredData(codeSchema, 'code-repo');
  }

  /**
   * Adds organization structured data
   */
  addOrganizationStructuredData(): void {
    const orgSchema: OrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': this._config.organization,
      'url': this._config.baseUrl,
      'description': 'Creator of innovative Angular libraries and tools',
      'sameAs': this._config.socialLinks
    };

    this.addStructuredData(orgSchema, 'organization');
  }

  /**
   * Removes all structured data from the document
   */
  removeAllStructuredData(): void {
    const scripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => script.remove());
  }
}