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
    // {
    //   title: 'Theme Service API',
    //   description: 'Comprehensive documentation of ThemeService methods and properties for managing themes in your application.',
    //   icon: 'palette',
    //   route: '/api/service-api',
    //   color: 'primary'
    // },
  ];

}
