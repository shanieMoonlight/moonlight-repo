import { AppRouteDefs } from '../../../app-route-defs';
import { NavCardData } from '../../../shared/ui/nav-card/nav-card.component';
import { StringUtils } from '../../../shared/utils/strings/string-utils';
import { MainSectionRoutesDefs } from '../main-route-defs';

/**
 * Route data for the main section of the application.
 * This data is used to generate navigation cards for the main section.
 * Routes are relative to main seciton so can be used in MainComponent and MainHomeComponent (and their navs or sidenavs etc.)
 * If you need to use this outside of Main Base then use the full path
 * e.g. `/${AppRouteDefs.fullPaths.main.route('about')}`<ImageView ...
 android:src="@drawable/psychology_alt_24"
/>
 */
export const MainRoutes: NavCardData[] = [
  {
    title: StringUtils.toTitleCase(MainSectionRoutesDefs.route('tutorial')),
    description: `Learn about the route architecture of the application.
  (This is a real component, not a demo)

    - MainSectionRoutesDefs.route('tutorial').`,
    route: MainSectionRoutesDefs.route('tutorial'),
    tooltip: `MainSectionRoutesDefs.route('tutorial')`,
    icon: 'psychology_alt',
    color: 'tertiary',
  },
  {
    title: StringUtils.toTitleCase(MainSectionRoutesDefs.route('about')),
    description: `Learn about us.

    - MainSectionRoutesDefs.route('about').`,
    route: MainSectionRoutesDefs.route('about'),
    tooltip: `MainSectionRoutesDefs.route('about')`,
    icon: 'info',
    color: 'primary',
  },
  {
    title: StringUtils.toTitleCase(MainSectionRoutesDefs.route('products')),
    description: `Checkout our product range

    - MainSectionRoutesDefs.route('products').`,
    route: MainSectionRoutesDefs.route('products'),
    tooltip: `MainSectionRoutesDefs.route('products')`,
    icon: 'shopfront',
    color: 'secondary',
  },
  {
    title: StringUtils.toTitleCase(MainSectionRoutesDefs.route('categories')),
    description: `Checkout our product categories.

    - MainSectionRoutesDefs.route('categories').`,
    route: MainSectionRoutesDefs.route('categories'),
    tooltip: `MainSectionRoutesDefs.route('categories')`,
    icon: 'dashboard',
    color: 'secondary',
  },
  {
    title: StringUtils.toTitleCase(MainSectionRoutesDefs.route('contact')),
    description: `Contact us.

    - MainSectionRoutesDefs.route('contact').`,
    route: MainSectionRoutesDefs.route('contact'),
    tooltip: `MainSectionRoutesDefs.route('contact')`,
    icon: 'email',
    color: 'tertiary',
  },
  {
    title: StringUtils.toTitleCase(AppRouteDefs.fullPaths.admin.route()),
    description: `Section for admins only.

    - AppRouteDefs.fullPathsWithSlash.admin.route()`,
    route: AppRouteDefs.fullPathsWithSlash.admin.route(), //Routing to separate section so using full path
    tooltip: `AppRouteDefs.fullPathsWithSlash.admin.route()`, //Routing to separate section so using full path
    icon: 'admin_panel_settings',
    color: 'tertiary',
  },
];
