import { InjectionToken, isDevMode } from '@angular/core';
import { devConsole } from '@spider-baby/dev-console';

//##################################################//

//No default or fallback. THis should error if not provided
export const SeoConfigService = new InjectionToken<SeoConfig>('SeoConfig',
  {
    factory: () => {

      if (isDevMode()) {
        console.warn('SeoConfigService: No SEO configuration provided. Using default values.');
      }

      return SeoConfig.create({
        appName: 'Spider Baby',
        appDescription: 'A collection of tools and utilities for Angular developers.',
        organization: 'Spider Baby',
        baseUrl: 'https://spider-baby-hub.web.app/',
        defaultLogoFilePath: 'assets/logo.png',
        publishedDate: new Date().toISOString(),
        keywords: ['Angular', 'SEO', 'Spider Baby'],
        defaultOgImageUrl: 'assets/og-image.png',
      })
    }
  }
)




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
}

//##################################################//

/**
 * Safely combines a base URL and a relative path.
 * Ensures no double slashes.
 * @param base Base URL (should ideally end with /)
 * @param path Relative path (can start with / or not)
 * @returns Combined absolute URL
 */
function combineUrl(base: string, path: string): string {
  const baseWithSlash = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${baseWithSlash}${cleanPath}`;
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
      // devConsole.warn(`SeoConfig: baseUrl should end with a trailing slash for proper URL combining. Adding slash automatically.`);
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

  //-----------------------------//

  /**
   * Simple check if a string is a valid URL or path
   * @param url The URL or path to validate
   * @returns True if valid
   */
  private static isValidUrl(url: string): boolean {
    // devConsole.log('Validating URL Input:', url); // Renamed log slightly for clarity

    // Accept absolute URLs
    if (url.match(/^https?:\/\/.+/))
      return true;

    // Accept relative paths (with or without leading /) that don't contain invalid characters
    // Basic check: doesn't contain spaces, hash, colon (outside protocol), or start with //
    // Allows: /path/to/img.png, path/to/img.png, img.png
    if (!url.includes(' ') && !url.includes('#') && !url.match(/[:]/) && !url.startsWith('//'))
      return true;

    return false;
  }

  //-----------------------------//

  /**
   * Private constructor to enforce use of static create method
   */
  private constructor(options: SeoConfigOptions) {
    this.appName = options.appName;
    this.appDescription = options.appDescription;
    this.organization = options.organization;
    this.baseUrl = options.baseUrl;

    this.defaultLogoFilePath = SeoConfig.resolveImagePath(
      this.baseUrl,
      options.defaultLogoFilePath,
      'assets/logo.png'
    );

    this.defaultOgImageUrl = SeoConfig.resolveImagePath(
      this.baseUrl,
      options.defaultOgImageUrl,
      'assets/og-image.png'
    );

    this.publishedDate = options.publishedDate || new Date().toISOString().split('T')[0];
    this.keywords = options.keywords || [];
    this.socialLinks = options.socialLinks || [];
    this.twitterHandle = options.twitterHandle || '';
  }

  //-----------------------------//

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

  //-----------------------------//

  /**
   * Resolves an optional input path (relative or absolute) to a guaranteed absolute URL,
   * falling back to a default relative path if the input is not provided.
   * @param baseUrl The base URL (ending with /).
   * @param inputPath The optional path provided in the options (relative or absolute).
   * @param defaultRelativePath The default relative path to use if inputPath is missing.
   * @returns The guaranteed absolute URL.
   */
  private static resolveImagePath(baseUrl: string, inputPath: string | undefined, defaultRelativePath: string): string {
    if (inputPath) {
      return inputPath.startsWith('http')
        ? inputPath
        : combineUrl(baseUrl, inputPath);
    } else {
      return combineUrl(baseUrl, defaultRelativePath);
    }
  }


} //Cls
