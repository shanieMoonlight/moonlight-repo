import { AppRouteDefs } from '../../../app-route-defs';
import { StringUtils } from '../../../shared/utils/strings/string-utils';
import { AdminRouteData } from '../../../shared/ui/admin-nav-card/admin-nav-card.component';

export const ProdAdminRoutes: AdminRouteData[] = [
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.products.route('categories')),
    description: 'Overview of key metrics and summary data for the application.',
    icon: 'dashboard',
    route: `/${AppRouteDefs.fullPaths.admin.products.route('categories')}`,
    color: 'primary',
  },
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.products.route('new')),
    description: 'Create and manage new product listings.', 
    icon: 'add_circle',
    route: `/${AppRouteDefs.fullPaths.admin.products.route('new')}`,
    color: 'secondary',
  },  
  {
    title: 'Customer Products Page',
    description: 'View the public product listing page.',
    icon: 'storefront',
    route: `/${AppRouteDefs.fullPaths.main.route('products')}`, 
    color: 'tertiary',
  },
];
