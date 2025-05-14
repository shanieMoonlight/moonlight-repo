import { AppRouteDefs } from "../../../../app-route-defs";
import { StringUtils } from "../../../../shared/utils/strings/string-utils";

//##############################################################//


export interface NavbarItem {
    route: string;
    tooltip: string;
    icon: string;
    text: string;
}


//##############################################################//

export const MainNavRoutes: NavbarItem[] = [
  {
    route: '/' + AppRouteDefs.fullPaths.main.route('home'),
    tooltip:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('home')),
    icon: 'home',
    text: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('home')),
  },
  {
    route: '/' + AppRouteDefs.fullPaths.main.route('about'),
    tooltip:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('about')),
    icon: 'info',
    text: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('about')),
  },
  {
    route: '/' + AppRouteDefs.fullPaths.main.route('products'),
    tooltip:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('products')),
    icon: 'shopfront',
    text: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('products')),
  },
  {
    route: '/' + AppRouteDefs.fullPaths.main.route('contact'),
    tooltip:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('contact')),
    icon: 'phone',
    text: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('contact')),
  },
];

//##############################################################//
