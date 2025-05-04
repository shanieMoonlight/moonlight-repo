import { SeoConfig } from "@spider-baby/utils-seo/config";
import { AppConstants } from "./constants";

export const SEO_CONFIG = SeoConfig.create({
    appName: 'SpiderBaby Tutorials',
    appDescription: 'Tutorials for Angular so we never forget again',
    organization: 'SpiderBaby',
    baseUrl: AppConstants.LIVE_URL,
})