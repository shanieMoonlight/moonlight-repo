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
    color: 'primary',
    img: HubAppImages.Blog.RouteDefsTutorial.large,
    imgPlaceholder: HubAppImages.Blog.RouteDefsTutorial.placeholder,

  },
    {
    title: 'Progressive Image Loading in Angular',
    description: 'Learn how to build a progressive image loading component in Angular that enhances user experience by loading low-quality placeholder images first, followed by high-quality versions when ready.',
    route: HubAppRouteDefs.fullPathsWithSlash.blog.route('prog-img-tutorial'),
    icon: 'image',
    color: 'secondary',
    img: HubAppImages.Blog.ProgImgsTutorial.large,
    imgPlaceholder: HubAppImages.Blog.ProgImgsTutorial.placeholder,
  },
    {
    title: 'Angular CDK Portal System Tutorial',
    description: 'Learn how to create a powerful Portal system using Angular CDK that allows you to dynamically render content anywhere in your application. Master portal inputs, outlets, bridges, and advanced patterns for complex UI scenarios.',
    route: HubAppRouteDefs.fullPathsWithSlash.blog.route('portal-tutorial'),
    icon: 'door_front',
    color: 'tertiary',
    img: HubAppImages.Blog.PortalTutorial.large,
    imgPlaceholder: HubAppImages.Blog.PortalTutorial.placeholder,
  },
];