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
    {
    title: 'Angular Mini-State Management Tutorial',
    description: 'Learn how to build reactive Angular applications with MiniState - a lightweight state management library that simplifies async operations, loading states, error handling, and UI feedback.',
    route: HubAppRouteDefs.fullPathsWithSlash.blog.route('mini-state-tutorial'),
    icon: 'merge',
    color: 'primary',
    img: HubAppImages.Blog.MiniStateTutorial.large,
    imgPlaceholder: HubAppImages.Blog.MiniStateTutorial.placeholder,
  },
    {
    title: 'Angular Material Theming',
    description: 'Master dynamic theming in Angular with @spider-baby/theming - a comprehensive library for Material Design 3 implementation, dark mode support, custom themes, hierarchical theming, and more...',
    route: HubAppRouteDefs.fullPathsWithSlash.blog.route('mat-theming'),
    icon: 'palette',
    color: 'primary',
    img: HubAppImages.Blog.MatThemingTutorial.large,
    imgPlaceholder: HubAppImages.Blog.MatThemingTutorial.placeholder,
  },
];