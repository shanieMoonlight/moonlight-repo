import { ApiRouteData } from '@spider-baby/ui-cards/api';
import { AppRouteDefs } from '../../../app-route-defs';
import { StringUtils } from '../../../shared/utils/strings/string-utils';

export const MAIN_ROUTES: ApiRouteData[] = [
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.main.route('about')),
    description: 'Learn about us.',
    route: '/' + AppRouteDefs.fullPaths.main.route('about'),
    icon: 'info',
    color: 'primary',
  },
  {
    title:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('products')),
    description: 'Checkout our product range.',
    route: '/' + AppRouteDefs.fullPaths.main.route('products'),
    icon: 'shopfront',
    color: 'secondary',
  },
  {
    title:  StringUtils.toTitleCase(AppRouteDefs.routes.main.route('contact')),
    description: 'Contact us.',
    route: '/' + AppRouteDefs.fullPaths.main.route('contact'),
    icon: 'email',
    color: 'tertiary',
  },
];
