// import { HubBlogSectionRoutesDefs } from '@sb-hub/sections-blog/route-defs';
import { HubAppRouteDefs } from '@sb-hub/app/route-definitions';
import { HubAppImages } from '@sb-hub/core-config/images';
import { ApiRouteData } from '@sb-hub/ui-cards/api';



export const HubBlogPrincipalRoutes: ApiRouteData[] = [
  {
    title: 'Angular Routing',
    description: 'Tackle routing complexities in large Angular apps. Learn a type-safe, hierarchical approach to eliminate magic strings, prevent typos, and simplify refactoring when route paths change, ensuring robust and maintainable navigation.',
    route: HubAppRouteDefs.fullPathsWithSlash.blog.route('route-defs-tutorial'),
    icon: 'follow_the_signs',
    color: 'secondary',
    img: HubAppImages.Blog.RouteDefsTutorial.large,
    imgPlaceholder: HubAppImages.Blog.RouteDefsTutorial.placeholder,

  },
    {
    title: 'Progressive Image Loading in Angular',
    description: 'Learn how to build a progressive image loading component in Angular that enhances user experience by loading low-quality placeholder images first, followed by high-quality versions when ready.',
    route: HubAppRouteDefs.fullPathsWithSlash.blog.route('prog-img-tutorial'),
    icon: 'image',
    color: 'secondary',
    img: HubAppImages.Blog.ProgImgsTutorial_1.large,
    imgPlaceholder: HubAppImages.Blog.ProgImgsTutorial_1.placeholder,

  },
];