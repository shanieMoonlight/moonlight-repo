import { ApiRouteData } from '@sb-hub/ui-cards/api';
import { HubAppRouteDefs } from '@sb-hub/app/route-definitions';
import { HubAppImages } from '@sb-hub/core-config/images';

export const MainPrincipalRoutes: ApiRouteData[] = [
  {
    title: 'Open Source',
    description:
      'Explore our collection of freely available code libraries and components, built with modern best practices and designed for maximum reusability across projects.',
    route: HubAppRouteDefs.fullPathsWithSlash.main.route('open-source'),
    icon: 'code',
    color: 'primary',
    img:HubAppImages.Main.OpenSource.default,
    imgPlaceholder: HubAppImages.Main.OpenSource.placeholder
  },
  {
    title: 'Blog',
    description:
      'Stay updated with our latest articles, tutorials, and insights on Angular development, best practices, and more.',
    route: HubAppRouteDefs.fullPathsWithSlash.blog.route(),
    icon: 'history_edu',
    color: 'secondary',
    img:HubAppImages.Blog.Home.default,
    imgPlaceholder: HubAppImages.Blog.Home.placeholder
  }
];
