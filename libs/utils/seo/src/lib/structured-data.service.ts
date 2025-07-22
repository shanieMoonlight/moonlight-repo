
import { inject, Injectable, DOCUMENT } from '@angular/core';
import { SeoConfig, SeoConfigService } from '@spider-baby/utils-seo/config';

//################################################//

/**
 * Base interface for all structured data schemas
 * All schema.org JSON-LD structured data must extend this interface
 */
export interface StructuredDataSchema {
  /** The schema.org context URL */
  '@context': 'https://schema.org';
  /** The schema.org type */
  '@type': string;
}

//################################################//

/**
 * Software Application schema type for describing applications
 * Used for libraries, tools, and other software products
 * @see https://schema.org/SoftwareApplication
 */
export interface SoftwareApplicationSchema extends StructuredDataSchema {
  '@type': 'SoftwareApplication';
  /** Name of the software */
  name: string;
  /** Application category (e.g., "DeveloperApplication", "BusinessApplication") */
  applicationCategory: string;
  /** Operating systems the software can run on */
  operatingSystem: string;
  /** Pricing information */
  offers?: {
    '@type': 'Offer';
    /** Price (use '0' for free) */
    price: string;
    /** Currency code (e.g., 'USD', 'EUR') */
    priceCurrency: string;
  };
  /** Description of the software's purpose and features */
  description: string;
  /** Software version number */
  softwareVersion?: string;
  /** URL where the software can be downloaded */
  downloadUrl?: string;
  /** Information about the software's creator */
  author?: {
    '@type': 'Person' | 'Organization';
    /** Name of the author/organization */
    name: string;
    /** URL to the author's website */
    url?: string;
  };
}

//################################################//

/**
 * Article schema type for documentation, blog posts, and technical articles
 * Helps search engines understand and display article content
 * @see https://schema.org/Article
 * @see https://schema.org/TechArticle
 */
export interface ArticleSchema extends StructuredDataSchema {
  '@type': 'TechArticle' | 'Article';
  /** Article title/headline */
  headline: string;
  /** Brief description of the article content */
  description: string;
  /** Information about who wrote the article */
  author: {
    '@type': 'Person';
    /** Author's name */
    name: string;
  };
  /** ISO date when the article was first published */
  datePublished: string;
  /** ISO date when the article was last modified */
  dateModified?: string;
  /** Information about the publishing organization */
  publisher?: {
    '@type': 'Organization';
    /** Publisher's name */
    name: string;
    /** Publisher's logo */
    logo?: {
      '@type': 'ImageObject';
      /** URL to the publisher's logo image */
      url: string;
    };
  };
  /** URL to the article's featured image */
  image?: string;
  /** URL of the canonical version of the article */
  mainEntityOfPage: string;
}

//################################################//

/**
 * FAQ schema type for Frequently Asked Questions sections
 * Enables rich results in search with expandable questions and answers
 * @see https://schema.org/FAQPage
 */
export interface FAQPageSchema extends StructuredDataSchema {
  '@type': 'FAQPage';
  /** List of questions and answers */
  mainEntity: Array<{
    '@type': 'Question';
    /** The question text */
    name: string;
    /** The answer to the question */
    acceptedAnswer: {
      '@type': 'Answer';
      /** The answer text (can include HTML) */
      text: string;
    };
  }>;
}

//################################################//

/**
 * Code schema type for library modules, components, and repositories
 * Helps identify software source code in search results
 * @see https://schema.org/SoftwareSourceCode
 */
export interface CodeSchema extends StructuredDataSchema {
  '@type': 'SoftwareSourceCode';
  /** URL to the code repository */
  codeRepository: string;
  /** Information about the programming language used */
  programmingLanguage: {
    '@type': 'ComputerLanguage';
    /** Name of the programming language */
    name: string;
  };
  /** The software application this code is for */
  targetProduct?: {
    '@type': 'SoftwareApplication';
    /** Name of the target application */
    name: string;
  };
  /** Description of what the code does */
  description: string;
}

//################################################//

/**
 * Organization schema type for company and project information
 * Improves entity recognition in search results
 * @see https://schema.org/Organization
 */
export interface OrganizationSchema extends StructuredDataSchema {
  '@type': 'Organization';
  /** Organization name */
  name: string;
  /** Organization website URL */
  url: string;
  /** URL to the organization's logo */
  logo?: string;
  /** Brief description of the organization */
  description?: string;
  /** URLs to social media profiles and related sites */
  sameAs?: string[];
}


//################################################//

/**
 * Service for managing structured data (JSON-LD) in the document
 * 
 * Structured data helps search engines understand content and display
 * rich results in search engine results pages (SERPs), improving
 * visibility and click-through rates.
 * 
 * This service supports multiple schema.org types, including:
 * - SoftwareApplication (for apps and libraries)
 * - Article/TechArticle (for documentation)
 * - FAQPage (for FAQ sections)
 * - SoftwareSourceCode (for code repositories)
 * - Organization (for company info)
 */
@Injectable({
  providedIn: 'root'
})
export class StructuredDataService {

  private document: Document = inject(DOCUMENT)
  private _config: SeoConfig = inject(SeoConfigService)

  //--------------------------------//

  /**
   * Adds structured data to the document as a JSON-LD script tag
   * 
   * @param schema - The structured data schema object to add
   * @param id - Optional ID to identify this schema for later updates
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

  //--------------------------------//

  /**
   * Adds library application structured data
   * 
   * This structured data helps search engines understand your software
   * application and may enable rich results in search.
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
      'description': this._config.appDescription,
      'softwareVersion': '1.0.0',
      'author': {
        '@type': 'Organization',
        'name': this._config.organization,
      }
    };

    this.addStructuredData(librarySchema, 'library-app');
  }

  //--------------------------------//

  /**
   * Adds documentation article structured data for a specific page
   * 
   * This enhances how documentation pages appear in search results and
   * may enable rich article features.
   * 
   * @param pageTitle - Title of the current page
   * @param pageDescription - Description of the current page
   * @param pageUrl - Full URL of the current page
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
      'datePublished': this._config.publishedDate,
      'dateModified': new Date().toISOString().split('T')[0], // Today's date for modified
      'publisher': {
        '@type': 'Organization',
        'name': this._config.organization,
        'logo': {
          '@type': 'ImageObject',
          'url': this._config.defaultLogoFilePath,
        }
      },
      'mainEntityOfPage': pageUrl
    };

    this.addStructuredData(articleSchema, 'documentation');
  }

  //--------------------------------//

  /**
   * Adds FAQ structured data for API documentation or help sections
   * 
   * This can enable FAQ rich results in search with expandable
   * question and answer sections.
   * 
   * @param faqs - Array of question-answer pairs
   */
  addFAQStructuredData(faqs: Array<{ question: string, answer: string }>): void {
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

  //--------------------------------//

  /**
   * Adds code repository structured data for the open source library
   * 
   * This helps identify your code repository in search results and
   * connects it to your software application.
   * 
   * @param repoUrl - URL to the code repository
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

  //--------------------------------//

  /**
   * Adds organization structured data
   * 
   * This helps search engines understand your organization entity
   * and can improve visibility in knowledge panels.
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

  //--------------------------------//

  /**
   * Removes all structured data from the document
   * 
   * Useful when navigating between pages or when you need to
   * completely reset the structured data.
   */
  removeAllStructuredData(): void {

    const scripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    
    scripts.forEach(script => {
      script.remove()
    });
  }


}//Cls