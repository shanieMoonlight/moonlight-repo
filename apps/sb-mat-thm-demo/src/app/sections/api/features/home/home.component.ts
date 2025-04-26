import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SbMatApiNavCardComponent, ApiRouteData } from '@spider-baby/ui-cards/api';

@Component({
  selector: 'sb-api-home',
  imports: [SbMatApiNavCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  apiRoutes: ApiRouteData[] = [
    {
      title: 'Theme Service API',
      description: 'Comprehensive documentation of ThemeService methods and properties for managing themes in your application.',
      icon: 'palette',
      route: '/api/service-api',
      color: 'primary'
    },
    {
      title: 'CSS Variables',
      description: 'Complete list of CSS variables available in the theming system for customizing your application.',
      icon: 'code',
      route: '/api/variables-list',
      color: 'secondary'
    },
    // {
    //   title: 'Configuration Options',
    //   description: 'Learn how to configure the theming system with various options and settings.',
    //   icon: 'settings',
    //   route: '/api/configuration',
    //   color: 'tertiary'
    // },
    // {
    //   title: 'Theme Models',
    //   description: 'Explore the data models used by the theming system including ThemeOption and ThemeConfig.',
    //   icon: 'schema',
    //   route: '/api/models',
    //   color: 'primary'
    // },
    // {
    //   title: 'Custom Themes',
    //   description: 'Guide to creating and managing custom themes in your application.',
    //   icon: 'brush',
    //   route: '/api/custom-themes',
    //   color: 'secondary'
    // },
    // {
    //   title: 'Integration Examples',
    //   description: 'Real-world examples of integrating the theming system with various UI components.',
    //   icon: 'integration_instructions',
    //   route: '/api/examples',
    //   color: 'tertiary'
    // }
  ];

}
