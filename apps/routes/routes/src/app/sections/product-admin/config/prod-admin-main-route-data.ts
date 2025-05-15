import { AppRouteDefs } from '../../../app-route-defs';
import { StringUtils } from '../../../shared/utils/strings/string-utils';
import { NavCardData } from '../../../shared/ui/nav-card/nav-card.component';
import { ProductAdminSectionRoutesDefs } from '../product-admin-route-defs';

/**
 * Product Admin Main Routes
 * 
 * This file contains the route data for the most important Product Admin section of the application.
 * Use in Navbars , Sidebars, Home Navigation Cards or any other navigation components.
 * 
 * @see {@link ProductAdminSectionRoutesDefs} for route definitions.
 */
export const ProdAdminMainRoutes: NavCardData[] = [
  {
    title: StringUtils.toTitleCase(ProductAdminSectionRoutesDefs.route('categories')),
    description: 'Overview of key metrics and summary data for the application.',
    icon: 'dashboard',
    route: ProductAdminSectionRoutesDefs.route('categories'),
    tooltip: `ProductAdminSectionRoutesDefs.route('categories')`,
    color: 'primary',
  },
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.products.route('new-product')),
    description: 'Create and manage new product listings.', 
    icon: 'add_circle',
    route: ProductAdminSectionRoutesDefs.route('new-product'),
    tooltip: `ProductAdminSectionRoutesDefs.route('new')`,
    color: 'secondary',
  },  
  {
    title: 'Customer Products Page',
    description: 'View the public product listing page.',
    icon: 'storefront',
    route: AppRouteDefs.fullPathsWithSlash.main.route('products'),  // 'withSlash' because this is a top-level route
    tooltip: `AppRouteDefs.fullPathsWithSlash.main.route('products')`,  
    color: 'tertiary',
  },
];