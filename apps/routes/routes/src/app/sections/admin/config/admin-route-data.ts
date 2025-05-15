import { AppRouteDefs } from '../../../app-route-defs';
import { StringUtils } from '../../../shared/utils/strings/string-utils';
import { AdminRouteData } from '../../../shared/ui/admin-nav-card/admin-nav-card.component';
import { AdminSectionRoutesDefs } from '../admin-route-defs';

export const AdminRoutes: AdminRouteData[] = [
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('dashboard')),
    description: 'Overview of key metrics and summary data for the application.',
    icon: 'dashboard',
    route: `${AdminSectionRoutesDefs.route('dashboard')}`,
    color: 'primary',
  },
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('users')),
    description: 'Manage users, including creating, editing, and deleting accounts.',
    icon: 'group',
    route: `${AdminSectionRoutesDefs.route('users')}`,
    color: 'secondary',
  },
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('settings')),
    description: 'Configure application settings and system preferences.',
    icon: 'settings',
    route: `${AdminSectionRoutesDefs.route('settings')}`,
    color: 'tertiary',
  },
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('reports')),
    description: 'View analytics, statistics, and generate data reports.',
    icon: 'bar_chart',
    route: `${AdminSectionRoutesDefs.route('reports')}`,
    color: 'primary',
  },
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('content')),
    description: 'Manage website or application content efficiently.',
    icon: 'content_paste',
    route: `${AdminSectionRoutesDefs.route('content')}`,
    color: 'secondary',
  },
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.products.route()),
    description: 'Manage products, including adding, editing, and deleting items.',
    icon: 'inventory_2',
    route: `/${AppRouteDefs.fullPaths.admin.products.route()}`,
    color: 'tertiary',
  },
];


// export const AdminRoutes: AdminRouteData[] = [
//   {
//     title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('dashboard')),
//     description: 'Overview of key metrics and summary data for the application.',
//     icon: 'dashboard',
//     route: `/${AppRouteDefs.fullPaths.admin.route('dashboard')}`,
//     color: 'primary',
//   },
//   {
//     title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('users')),
//     description: 'Manage users, including creating, editing, and deleting accounts.',
//     icon: 'group',
//     route: `/${AppRouteDefs.fullPaths.admin.route('users')}`,
//     color: 'secondary',
//   },
//   {
//     title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('settings')),
//     description: 'Configure application settings and system preferences.',
//     icon: 'settings',
//     route: `/${AppRouteDefs.fullPaths.admin.route('settings')}`,
//     color: 'tertiary',
//   },
//   {
//     title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('reports')),
//     description: 'View analytics, statistics, and generate data reports.',
//     icon: 'bar_chart',
//     route: `/${AppRouteDefs.fullPaths.admin.route('reports')}`,
//     color: 'primary',
//   },
//   {
//     title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.route('content')),
//     description: 'Manage website or application content efficiently.',
//     icon: 'content_paste',
//     route: `/${AppRouteDefs.fullPaths.admin.route('content')}`,
//     color: 'secondary',
//   },
//   {
//     title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.products.route()),
//     description: 'Manage products, including adding, editing, and deleting items.',
//     icon: 'inventory_2',
//     route: `/${AppRouteDefs.fullPaths.admin.products.route()}`,
//     color: 'tertiary',
//   },
// ];
