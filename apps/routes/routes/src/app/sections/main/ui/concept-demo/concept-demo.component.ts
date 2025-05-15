import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { MainSectionRoutesDefs } from '../../main-route-defs';
import { AppRouteDefs } from '../../../../app-route-defs';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';

//####################################//

interface RouteExample {
  description: string;
  code: string;
  result: string;
  path?: string;
}

//####################################//


@Component({
  selector: 'rd-concept-demo',
  imports: [
    MatEverythingModule,
    RouterModule,
    HighlightModule,
  ],
  templateUrl: './concept-demo.component.html',
  styleUrl: './concept-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptDemoComponent implements OnInit {

  mainRoutes: string[] = ['about', 'contact', 'home', 'products', 'categories'];
  adminRoutes: string[] = ['dashboard', 'users', 'settings', 'reports', 'content'];
  productAdminRoutes: string[] = ['home', 'new-product', 'categories'];
  
  routeExamples: RouteExample[] = [
    {
      description: 'Getting a relative route segment (Main section)',
      code: `MainSectionRoutesDefs.route('about') //(Since we're using it from the main section)`,
      result: MainSectionRoutesDefs.routes.route('about'),
      path: MainSectionRoutesDefs.route('about')
    },
    {
      description: 'Getting a full path via AppRouteDefs (Admin section)',
      code: `AppRouteDefs.fullPathsWithSlash.admin('dashboard')`,
      result: AppRouteDefs.fullPathsWithSlash.admin.route('dashboard'),
      path: AppRouteDefs.fullPathsWithSlash.admin.route('dashboard')
    },
    {
      description: 'Getting a path with leading slash',
      code: `AppRouteDefs.fullPathsWithSlash.main('products')`,
      result: AppRouteDefs.fullPathsWithSlash.main.route('products'),
      path: AppRouteDefs.fullPathsWithSlash.main.route('products')
    },
    {
      description: 'Accessing nested route (Product Admin within Admin)',
      code: `AppRouteDefs.fullPathsWithSlash.admin.products('new-product')`,
      result: AppRouteDefs.fullPathsWithSlash.admin.products.route('new-product'),
      path: AppRouteDefs.fullPathsWithSlash.admin.products.route('new-product')
    },
    {
      description: 'Getting base segment of a section',
      code: `AppRouteDefs.fullPathsWithSlash.admin.route()`,
      result: AppRouteDefs.fullPathsWithSlash.admin.route(),
      path: AppRouteDefs.fullPathsWithSlash.admin.route()
    }
  ];
  
  benefits = [
    {
      title: 'Type Safety',
      description: 'Route paths are type-checked, preventing typos and ensuring only valid routes are used.'
    },
    {
      title: 'Single Source of Truth',
      description: 'Routes are defined in one place, making updates and refactoring easier and safer.'
    },
    {
      title: 'Hierarchy Awareness',
      description: 'The route structure reflects the application structure, making navigation intuitive.'
    },
    {
      title: 'IDE Support',
      description: 'Autocomplete and IntelliSense show available routes, improving developer experience.'
    },
    {
      title: 'Consistency',
      description: 'Standardized approach to route management across the entire application.'
    },
    {
      title: 'Flexible Formatting',
      description: 'Options like fullPathsWithSlash make it easy to get paths in the exact format needed.'
    }
  ];
  
  patterns = [
    {
      title: 'Route Definition Class',
      description: 'Basic pattern for defining route segments and full paths',
      code: `export class SectionRoutesDefs {
  static readonly BASE = 'section-name';
  
  static routes = {
    route: (child?: CHILD_ROUTE) => child ?? this.BASE
  };
  
  static fullPathFn = (parentPath: string) => 
    (route?: CHILD_ROUTE) => {
      const base = parentPath ? \`\${parentPath}/\${this.BASE}\` : this.BASE;
      return route ? \`\${base}/\${route}\` : base;
    };
}`
    },
    {
      title: 'Using the wrapWithLeadingSlash Utility',
      description: 'How the utility recursively adds leading slashes to all path functions',
      code: `// Define path without slash
const path = AppRouteDefs.fullPaths.admin('users');
// Result: "admin/users"

// Use the wrapped version for paths with slashes
const pathWithSlash = AppRouteDefs.fullPathsWithSlash.admin('users');
// Result: "/admin/users"`
    },
    {
      title: 'Nested Route Sections',
      description: 'How to define and use nested route sections',
      code: `// In AdminSectionRoutesDefs
static routes = {
  route: (child?: ADMIN_CHILD_ROUTE) => child ?? this.BASE,
  products: ProductAdminSectionRoutesDefs.routes
};

// Usage
AdminSectionRoutesDefs.routes.products.route('new-product');
// Result: "new-product"`
    }
  ];
  
  
  ngOnInit() {
    console.log('ConceptDemoComponent initialized');
    
    // You could load real route data dynamically here if needed
  }
}