import { AppRouteDefs } from "../../../../app-route-defs";
import { NavbarItem } from "../../../../shared/models/navbar-item";
import { StringUtils } from "../../../../shared/utils/strings/string-utils";
import { MainSectionRoutesDefs } from "../../main-route-defs";

export const MainNavRoutes: NavbarItem[] = [
  {
    route: MainSectionRoutesDefs.route('home'),
    tooltip:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('home')),
    icon: 'home',
    text: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('home')),
  },
  {
    route: MainSectionRoutesDefs.route('about'),
    tooltip:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('about')),
    icon: 'info',
    text: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('about')),
  },
  {
    route: MainSectionRoutesDefs.route('products'),
    tooltip:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('products')),
    icon: 'shopfront',
    text: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('products')),
  },
  {
    route: MainSectionRoutesDefs.route('contact'),
    tooltip:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('contact')),
    icon: 'phone',
    text: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('contact')),
  },
];
