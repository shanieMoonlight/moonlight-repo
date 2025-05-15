import { AppRouteDefs } from '../../../app-route-defs';
import { StringUtils } from '../../../shared/utils/strings/string-utils';
import { NavCardData } from '../../../shared/ui/nav-card/nav-card.component';
import { AdminSectionRoutesDefs } from '../admin-route-defs';

export const AdminMainRoutes: NavCardData[] = [
  {
    title: StringUtils.toTitleCase(AdminSectionRoutesDefs.route('dashboard')),
    description: 'Overview of key metrics and summary data for the application.',
    icon: 'dashboard',
    route: AdminSectionRoutesDefs.route('dashboard'),
    tooltip: `AdminSectionRoutesDefs.route('dashboard')`,
    color: 'primary',
  },
  {
    title: StringUtils.toTitleCase(AdminSectionRoutesDefs.route('users')),
    description: 'Manage users, including creating, editing, and deleting accounts.',
    icon: 'group',
    route: AdminSectionRoutesDefs.route('users'),
    tooltip: `AdminSectionRoutesDefs.route('users')`,
    color: 'secondary',
  },
  {
    title: StringUtils.toTitleCase(AdminSectionRoutesDefs.route('settings')),
    description: 'Configure application settings and system preferences.',
    icon: 'settings',
    route: AdminSectionRoutesDefs.route('settings'),
    tooltip: `AdminSectionRoutesDefs.route('settings')`,
    color: 'tertiary',
  },
  {
    title: StringUtils.toTitleCase(AdminSectionRoutesDefs.route('reports')),
    description: 'View analytics, statistics, and generate data reports.',
    icon: 'bar_chart',
    route: AdminSectionRoutesDefs.route('reports'),
    tooltip: `AdminSectionRoutesDefs.route('reports')`,
    color: 'primary',
  },
  {
    title: StringUtils.toTitleCase(AdminSectionRoutesDefs.route('content')),
    description: 'Manage website or application content efficiently.',
    icon: 'content_paste',
    route: AdminSectionRoutesDefs.route('content'),
    tooltip: `AdminSectionRoutesDefs.route('content')`,
    color: 'secondary',
  },
  {
    title: StringUtils.toTitleCase(AppRouteDefs.routes.admin.products.route()),
    description: `Manage products, including adding, editing, and deleting items.
- This is a subsection with its own routes. 
- See address bar`,
    icon: 'inventory_2',
    route: AppRouteDefs.fullPathsWithSlash.admin.products.route(),
    tooltip: `AppRouteDefs.fullPathsWithSlash.admin.products.route()`,
    color: 'tertiary',
  },
];