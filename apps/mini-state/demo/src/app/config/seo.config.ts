import { SeoConfig } from "@spider-baby/utils-seo/config";
import { AppConstants } from "./constants";
import { AppImages } from "./images";

export const SEO_CONFIG = SeoConfig.create({
    appName: 'Mini-State',
    appDescription: 'A lightweight, signals-based state management library for Angular applications, handling loading states, errors, and success notifications while leveraging Angular\'s signals for reactivity.',
    organization: 'SpiderBaby',
    baseUrl: AppConstants.DEMO_URL,
    keywords: ['Angular', 'State Management', 'Signals', 'Mini-State', 'Angular library', 'Reactive State'],
    defaultLogoFilePath: AppImages.Logo.medium,
    defaultOgImageUrl: AppImages.Logo.medium
})