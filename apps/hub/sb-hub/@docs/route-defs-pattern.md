# Route Definition Pattern

This document outlines the pattern used for defining and constructing URL routes within the Hub application. The goal is to provide a centralized, type-safe, and maintainable way to manage route paths, avoiding magic strings.

## Core Concepts

1.  **Area-Specific Definitions**: Routes are organized into "areas" (e.g., `main`, `admin`), each with its own definition class (e.g., `HubMainAreaRoutesDefs`, `HubAdminAreaRoutesDefs`).
2.  **Application Root Definition**: A top-level class (`HubAppRouteDefs`) aggregates area definitions and provides access to all routes from the application root.
3.  **`BASE` Constant**: Each route definition class has a `static readonly BASE` constant representing its primary path segment (e.g., `main` for `HubMainAreaRoutesDefs`, `administration` for `HubAdminAreaRoutesDefs`). The `HubAppRouteDefs.BASE` is typically an empty string `'''`.
4.  **`CHILD_ROUTE` Types**: These type aliases (e.g., `type CHILD_ROUTE = 'home' | 'open-source';`) define the valid **endpoint** segments for a specific area. They represent the final page in a route path and are **not** used to define further nested route sections. To access segments or full paths of nested sections (like `admin` within `main`), you use the `routes.areaName.route()` or `fullPaths.areaName.route()` accessor pattern.

## Key Properties and Methods

Route definition classes (e.g., `HubAppRouteDefs`, `HubMainAreaRoutesDefs`, `HubAdminAreaRoutesDefs`) expose two primary static objects for path construction:

### 1. `routes` (e.g., `HubAppRouteDefs.routes.main`)

*   **Purpose**: Provides access to *relative* route segments or the base segment of the current area/sub-area.
*   **Structure**:
    *   `someArea.routes.route(child?: CHILD_ROUTE_TYPE): string` (or `someArea.routes.subArea.route(child?: SUB_AREA_CHILD_ROUTE_TYPE)` for nested areas):
        *   If `child` (an endpoint defined in `CHILD_ROUTE_TYPE`) is provided, returns that child segment (e.g., `'home'`, `'users'`).
        *   If `child` is omitted, returns the `BASE` segment of the class defining this `route` method (e.g., `'main'`, `'administration'`).
*   **Nesting**: `HubAppRouteDefs.routes` nests area definitions, allowing access like `HubAppRouteDefs.routes.main.route()` or `HubAppRouteDefs.routes.main.admin.route()`.

### 2. `fullPaths` (e.g., `HubAppRouteDefs.fullPaths.main`)

*   **Purpose**: Provides access to *absolute* URL paths, constructed from the application root.
*   **Structure**:
    *   `someArea.fullPaths.route(child?: CHILD_ROUTE_TYPE): string` (or `someArea.fullPaths.subArea.route(child?: SUB_AREA_CHILD_ROUTE_TYPE)` for nested areas):
        *   If `child` (an endpoint) is provided, returns the full path to that child segment (e.g., `'main/home'`, `'main/administration/users'`).
        *   If `child` is omitted, returns the full path to the `BASE` of the area corresponding to this `route` method (e.g., `'main'`, `'main/administration'`).
*   **Nesting**: Similar to `routes`, `HubAppRouteDefs.fullPaths` nests area definitions.

### Internal Helper: `fullPathFn(parentRoute: string)`

*   Area-specific definition classes (e.g., `HubMainAreaRoutesDefs`, `HubAdminAreaRoutesDefs`) include a `static fullPathFn(parentRoute: string)` method.
*   This function is used by a parent definition class (like `HubAppRouteDefs` using `HubMainAreaRoutesDefs.fullPathFn`, or `HubMainAreaRoutesDefs` using `HubAdminAreaRoutesDefs.fullPathFn`) to construct the `fullPaths` for that area. It takes the accumulated `parentRoute` and prepends it to the current area's segments. A `HubRouteUtility.Combine` method is typically used for joining path segments.

## Example Usage & Output

The following examples demonstrate how to use these definitions (typically accessed via `HubAppRouteDefs`):

```typescript
// Assuming _appRouteDefs is HubAppRouteDefs

// Accessing 'main' area segments and paths
_appRouteDefs.routes.main.route()                  // Output: "main"
_appRouteDefs.fullPaths.main.route()               // Output: "main"

_appRouteDefs.routes.main.route('home')            // Output: "home"
_appRouteDefs.fullPaths.main.route('home')         // Output: "main/home"

_appRouteDefs.routes.main.route('open-source')     // Output: "open-source"
_appRouteDefs.fullPaths.main.route('open-source')  // Output: "main/open-source"

// Accessing 'admin' area (nested under 'main') segments and paths
_appRouteDefs.routes.main.admin.route()            // Output: "administration"
_appRouteDefs.fullPaths.main.admin.route()         // Output: "main/administration"

_appRouteDefs.routes.main.admin.route('users')     // Output: "users"
_appRouteDefs.fullPaths.main.admin.route('users')  // Output: "main/administration/users"
```

This pattern ensures that route construction is consistent and changes to base paths or segments can be made in a single location.
Additionally, area-specific classes like `HubMainAreaRoutesDefs` may expose a simpler `static route(param: DIRECT_CHILD_OR_BASE): string` for direct use within that area's routing files (e.g. `MAIN_ROUTES` in `main.routes.ts`).

## Full Code Examples

Below are the three core `*-route-defs.ts` files without comments for a concise overview of the implementation.

### `Base routes for the entire app`

```typescript
import { MainAreaRoutesDefs } from '@sb-hub/sections-main/route-defs';

const BaseRoute = '';

export class AppRouteDefs {
    static readonly BASE = BaseRoute;

    static routes = {
        main: MainAreaRoutesDefs.routes,
    };

    static fullPaths = {
        main: MainAreaRoutesDefs.fullPathFn(this.BASE),
    };
}
```

### `Main section routes for the app (nested in AppRouteDefs)`

```typescript
import { RouteUtility } from '@sb-hub/shared-utils/routes';
import { AdminAreaRoutesDefs } from './admin-route-defs';

const BaseRoute = 'main';
type CHILD_ROUTE = 'home' | 'open-source';
type ROUTE = typeof BaseRoute | CHILD_ROUTE;

export class MainAreaRoutesDefs {
  public static readonly BASE = BaseRoute;

  static route = (route: ROUTE) => route;

  static routes = {
    route: (route?: CHILD_ROUTE) => route ?? MainAreaRoutesDefs.BASE,
    admin: AdminAreaRoutesDefs.routes,
  };

  static fullPath = {
    route: (route?: CHILD_ROUTE) => RouteUtility.Combine(MainAreaRoutesDefs.BASE, route),
    admin: AdminAreaRoutesDefs.fullPathFn(MainAreaRoutesDefs.BASE),
  };

  static fullPathFn = (parentRoute: string) => {
    const basePath = RouteUtility.Combine(parentRoute, MainAreaRoutesDefs.BASE);
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.Combine(basePath, route),
      admin: AdminAreaRoutesDefs.fullPathFn(basePath),
    };
  };
}
```

### `Admin section routes for the Main-Section (nested in MainAreaRoutesDefs)`

```typescript
import { RouteUtility } from '@sb-hub/shared-utils/routes';

const BaseRoute = 'administration';
type CHILD_ROUTE = 'home' | 'users' | 'teams' | 'settings';
type ROUTE = typeof BaseRoute | CHILD_ROUTE;

export class AdminAreaRoutesDefs {
  public static readonly BASE = BaseRoute;

  static route = (route: ROUTE) => route;

  static routes = {
    route: (route?: CHILD_ROUTE) => route ?? AdminAreaRoutesDefs.BASE,
  };

  static fullPath = {
    route: (route?: CHILD_ROUTE) => RouteUtility.Combine(this.BASE, route),
  };

  static fullPathFn = (parentRoute: string) => {
    const basePath = RouteUtility.Combine(parentRoute, AdminAreaRoutesDefs.BASE);
    return {
      route: (route?: CHILD_ROUTE) => RouteUtility.Combine(basePath, route),
    };
  };
}
```
