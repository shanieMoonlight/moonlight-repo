// import { HubBlogSectionRoutesDefs } from '@sb-hub/sections-blog/route-defs';
import { HubAppRouteDefs } from '@sb-hub/app/route-definitions';
import { HubAppImages } from '@sb-hub/core-config/images';
import { ApiRouteData } from '@sb-hub/ui-cards/api';



export const HubBlogPrincipalRoutes: ApiRouteData[] = [
  {
    title: 'Angular Routing',
    description: 'Tackle routing complexities in large Angular apps. Learn a type-safe, hierarchical approach to eliminate magic strings, prevent typos, and simplify refactoring when route paths change, ensuring robust and maintainable navigation.',
    route: HubAppRouteDefs.fullPathsWithSlash.blog.route('route-defs-tutorial'),
    icon: 'follow_the_signs_',
    color: 'secondary',
    img: HubAppImages.Blog.RouteDefsTutorial.large,
    imgPlaceholder: HubAppImages.Blog.RouteDefsTutorial.placeholder,

  },
];