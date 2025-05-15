import { ApiRouteData } from '@spider-baby/ui-cards/api';
import { AppRouteDefs } from '../../../app-route-defs';
import { StringUtils } from '../../../shared/utils/strings/string-utils';
import { MainSectionRoutesDefs } from '../main-route-defs';

/**
 * Route data for the main section of the application.
 * This data is used to generate navigation cards for the main section.
 * Routes are relative to main seciton so can be used in MainComponent and MainHomeComponent (and their navs or sidenavs etc.)
 * If you need to use this outside of Main Base then use the full path
 * e.g. `/${AppRouteDefs.fullPaths.main.route('about')}`
 */
export const MainRoutes: ApiRouteData[] = [
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('about')),
    description: 'Learn about us.',
    route: MainSectionRoutesDefs.route('about'),
    icon: 'info',
    color: 'primary',
  },
  {
    title:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('products')),
    description: 'Checkout our product range.',
    route: MainSectionRoutesDefs.route('products'),
    icon: 'shopfront',
    color: 'secondary',
  },
  {
    title:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('categories')),
    description: 'Checkout our product categories.',
    route: MainSectionRoutesDefs.route('categories'),
    icon: 'dashboard',
    color: 'secondary',
  },
  {
    title:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('contact')),
    description: 'Contact us.',
    route: MainSectionRoutesDefs.route('contact'),
    icon: 'email',
    color: 'tertiary',
  },  
  {
    title:  StringUtils.toTitleCase(AppRouteDefs.fullPaths.admin.route()),
    description: 'Seciont for admins only',
    route: `/${AppRouteDefs.fullPaths.admin.route()}`, //Routing to separate section so using full path
    icon: 'admin_panel_settings',
    color: 'tertiary',
  },
];
