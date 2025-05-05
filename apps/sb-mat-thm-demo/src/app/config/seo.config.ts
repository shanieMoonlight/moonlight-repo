import { SeoConfig } from "@spider-baby/utils-seo/config";
import { AppConstants } from "./constants";
import { AppImages } from "./images";

export const SEO_CONFIG = SeoConfig.create({
    appName: 'SpiderBaby Material Theming',
    appDescription: 'A powerful, flexible theming system for Angular Material with dynamic theme switching, section-based theming, and Material Design 3 support.',
    organization: 'SpiderBaby',
    baseUrl: AppConstants.LIVE_URL,
    keywords: ['Angular Material', 'Material Design','theming', 'CSS variables', 'dark mode', 'theme customization', 'Angular library'],
    defaultLogoFilePath: AppImages.Logo.medium,
    defaultOgImageUrl: AppImages.Logo.medium
})