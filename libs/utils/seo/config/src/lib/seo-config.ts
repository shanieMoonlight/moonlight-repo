import { InjectionToken } from '@angular/core';
import { devConsole } from '@spider-baby/dev-console';

//##################################################//

//No default or fallback. THis should error if not provided
export const SeoConfigService = new InjectionToken<SeoConfig>('SeoConfig')


//##################################################//

/** Interface for SeoConfig creation options */
export interface SeoConfigOptions {
  /** Application name */
  appName: string;
  /** Application description */
  appDescription: string;
  /** Organization name */
  organization: string;
  /** Base URL for the application (with trailing slash) */
  baseUrl: string;
  /** Path to default logo */
  defaultLogoFilePath?: string;
  /** Date when the app/content was published */
  publishedDate?: string;
  /** Keywords relevant to the app */
  keywords?: string[];
  /** Social media profile URLs */
  socialLinks?: string[];
  /** Default OG image URL */
  defaultOgImageUrl?: string;
  /** Twitter handle */
  twitterHandle?: string;
  /** Default page title suffix */
  titleSuffix?: string;
}

//##################################################//

export class SeoConfig {
  /** Application name */
  readonly appName: string;
  /** Application description */
  readonly appDescription: string;
  /** Organization name */
  readonly organization: string;
  /** Base URL for the application (with trailing slash) */
  readonly baseUrl: string;
  /** Path to default logo */
  readonly defaultLogoFilePath: string;
  /** Date when the app/content was published */
  readonly publishedDate: string;
  /** Keywords relevant to the app */
  readonly keywords: string[];
  /** Social media profile URLs */
  readonly socialLinks: string[];
  /** Default OG image URL */
  readonly defaultOgImageUrl: string;
  /** Twitter handle */
  readonly twitterHandle: string;
  /** Default page title suffix */
  readonly titleSuffix: string;

  /**
   * Creates a new SEO configuration with validation
   * @param options The SEO configuration options
   * @returns A new SeoConfig instance
   */
  static create(options: SeoConfigOptions): SeoConfig {
    // Validate required fields
    this.validateRequiredFields(options);
    
    // Validate URL format
    this.validateUrls(options);
    
    return new SeoConfig(options);
  }

  /**
   * Validates that all required fields are present
   * @param options The SEO configuration options
   * @throws Error if any required fields are missing
   */
  private static validateRequiredFields(options: SeoConfigOptions): void {
    const requiredFields: (keyof SeoConfigOptions)[] = ['appName', 'appDescription', 'organization', 'baseUrl'];
    
    for (const field of requiredFields) {
      if (!options[field]) {
        throw new Error(`SeoConfig: ${field} is required but was not provided`);
      }
    }
  }

  /**
   * Validates that URLs are properly formatted
   * @param options The SEO configuration options
   * @throws Error if any URLs are invalid
   */
  private static validateUrls(options: SeoConfigOptions): void {
    // Validate baseUrl format
    if (!options.baseUrl.match(/^https?:\/\/.+/)) {
      throw new Error(`SeoConfig: baseUrl must be a valid URL starting with http:// or https://`);
    }
    
    // Ensure baseUrl ends with a trailing slash
    if (!options.baseUrl.endsWith('/')) {
      console.warn(`SeoConfig: baseUrl should end with a trailing slash for proper URL combining. Adding slash automatically.`);
      options.baseUrl = `${options.baseUrl}/`;
    }
    
    // Validate optional URLs
    if (options.defaultLogoFilePath && !this.isValidUrl(options.defaultLogoFilePath)) {
      throw new Error(`SeoConfig: defaultLogoFilePath must be a valid URL or path`);
    }
    
    if (options.defaultOgImageUrl && !this.isValidUrl(options.defaultOgImageUrl)) {
      throw new Error(`SeoConfig: defaultOgImageUrl must be a valid URL`);
    }
    
    // Validate social links
    if (options.socialLinks) {
      options.socialLinks.forEach((link, index) => {
        if (!this.isValidUrl(link)) {
          throw new Error(`SeoConfig: socialLinks[${index}] must be a valid URL`);
        }
      });
    }
  }

  /**
   * Simple check if a string is a valid URL or path
   * @param url The URL or path to validate
   * @returns True if valid
   */
  private static isValidUrl(url: string): boolean {
    devConsole.log('Validating URL:', url);
    // Accept absolute URLs
    if (url.match(/^https?:\/\/.+/)) {
      return true;
    }
    
    // Accept relative paths that don't contain invalid characters
    if (url.startsWith('/') && !url.includes(' ') && !url.includes('#')) {
      return true;
    }
    
    return false;
  }

  /**
   * Private constructor to enforce use of static create method
   */
  private constructor(options: SeoConfigOptions) {
    this.appName = options.appName;
    this.appDescription = options.appDescription;
    this.organization = options.organization;
    this.baseUrl = options.baseUrl;
    
    // Set optional fields with defaults
    this.defaultLogoFilePath = options.defaultLogoFilePath || `${this.baseUrl}assets/logo.png`;
    this.publishedDate = options.publishedDate || new Date().toISOString().split('T')[0];
    this.keywords = options.keywords || [];
    this.socialLinks = options.socialLinks || [];
    this.defaultOgImageUrl = options.defaultOgImageUrl || `${this.baseUrl}assets/og-image.png`;
    this.twitterHandle = options.twitterHandle || '';
    this.titleSuffix = options.titleSuffix || ` | ${this.appName}`;
  }

  /**
   * Checks if the configuration is complete for comprehensive SEO
   * @returns Object with properties indicating which recommended fields are missing
   */
  getConfigurationCompleteness(): Record<string, boolean> {
    return {
      hasSocialLinks: this.socialLinks.length > 0,
      hasTwitterHandle: !!this.twitterHandle,
      hasKeywords: this.keywords.length > 0,
      hasCustomOgImage: this.defaultOgImageUrl !== `${this.baseUrl}assets/og-image.png`,
      hasCustomLogo: this.defaultLogoFilePath !== `${this.baseUrl}assets/logo.png`,
    };
  }
} //Cls
