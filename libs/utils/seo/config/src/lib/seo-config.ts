import { InjectionToken } from '@angular/core';

//##################################################//

//No default or fallback. THis should error if not provided
export const SeoConfigService = new InjectionToken<SeoConfig>('SeoConfig')


//##################################################//

/** Interface for SeoConfig creation options */
export interface SeoConfigOptions {
  appName: string
  defaultAppDescription: string
  defaultLogoFilePath: string
  baseUrl: string
  appType?: string
  applicationCategory?: string
  operatingSystem?: string
  offers?: any
  organization?: string
  publishedDate: string
  socialLinks?: string[] 
}

//##################################################//

export class SeoConfig {

  appName: string = 'Default Title';
  appDescription: string = 'An amazing application that does amazing things.';
  defaultLogoFilePath: string = '/images/og-image.jpg';
  baseUrl: string = 'https://example.com';
  appType: string = 'SoftwareApplication';
  applicationCategory: string = 'DeveloperApplication'
  operatingSystem: string = 'Web'
  publishedDate: string = '1999-01-01T00:00:00Z'
  offers: any = {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'EUR'
  }
  organization: string = 'SpiderBaby'
  socialLinks: string[] = []

  //- - - - - - - - - - - - - - - //

  /**
   * Private constructor to prevent direct instantiation.
   * Use SeoConfig.create() factory method instead.
   */
  private constructor(options: SeoConfigOptions) {
    this.appName = options.appName || this.appName;
    this.appDescription = options.defaultAppDescription || this.appDescription;
    this.defaultLogoFilePath = options.defaultLogoFilePath || this.defaultLogoFilePath;
    this.baseUrl = options.baseUrl || this.baseUrl;
    this.appType = options.appType || this.appType;
    this.applicationCategory = options.applicationCategory || this.applicationCategory;
    this.operatingSystem = options.operatingSystem || this.operatingSystem;
    this.offers = options.offers || this.offers;
    this.organization = options.organization || this.organization;
    this.publishedDate = options.publishedDate || this.publishedDate;
    this.socialLinks = options.socialLinks || this.socialLinks;
  }

  //------------------------------//

  /**
   * Creates a new SeoConfig instance using an options object.
   *
   * @param options Configuration object for creating the theme config
   * @returns A new validated SeoConfig instance
   */
  static create(options: SeoConfigOptions): SeoConfig {
    // The constructor now handles applying defaults
    return new SeoConfig(options);
  }

  //------------------------------//   

} //Cls
