import { SeoConfig } from "@spider-baby/utils-seo/config";
import { AppConstants } from "./constants";
import { AppImages } from "./images";

export const SEO_CONFIG = SeoConfig.create({
    appName: 'myid-demo',
    appDescription: `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`,
    organization: 'SpiderBaby',
    baseUrl: AppConstants.DEMO_URL,
    keywords: ['Angular', 'SpiderBaby'],
    defaultLogoFilePath: AppImages.Logo.medium,
    defaultOgImageUrl: AppImages.Logo.medium
})