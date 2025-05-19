import { HubAppConstants } from '@sb-hub/core-config/constants';
import { HubAppImages } from '@sb-hub/core-config/images';
import { SeoConfig } from '@spider-baby/utils-seo/config';

export const SEO_CONFIG = SeoConfig.create({

  appName: 'Spider-Baby',
  appDescription: `Welcome to Spider-Baby's Hub, a personal space dedicated to exploring the world of web development and open source. Discover insightful blog articles, browse through innovative projects, and get a glimpse into my coding journey.`,
  organization: 'SpiderBaby',
  baseUrl: HubAppConstants.DEMO_URL,
  keywords: ['Angular', 'SpiderBaby'],
  defaultLogoFilePath: HubAppImages.Logo.medium,
  defaultOgImageUrl: HubAppImages.Logo.medium,
});
