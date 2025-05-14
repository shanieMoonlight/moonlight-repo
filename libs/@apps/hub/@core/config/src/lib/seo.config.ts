import { HubAppConstants } from '@sb-hub/core-config/constants';
import { HubAppImages } from '@sb-hub/core-config/images';
import { SeoConfig } from '@spider-baby/utils-seo/config';

export const SEO_CONFIG = SeoConfig.create({
  appName: 'Spider-Baby',
  appDescription: `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`,
  organization: 'SpiderBaby',
  baseUrl: HubAppConstants.DEMO_URL,
  keywords: ['Angular', 'SpiderBaby'],
  defaultLogoFilePath: HubAppImages.Logo.medium,
  defaultOgImageUrl: HubAppImages.Logo.medium,
});
