import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { SbMatApiNavCardComponent } from '@sb-hub/ui-cards/api';
import { SeoService } from '@spider-baby/utils-seo';
import { API_ROUTES } from '../../config/route-data';


@Component({
  selector: 'sb-api-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    SbMatApiNavCardComponent
  ]
})
export class ApiHomeComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)

  //- - - - - - - - - - - - - - -//

  _apiRoutes = signal(API_ROUTES)

  //-----------------------------//

  ngOnInit() {
    // Set SEO metadata specific to the API Home page
    this._seoService.updateMetadata({
      title: 'API Documentation Home - SpiderBaby Material Theming',
      description: 'Explore the API documentation for SpiderBaby Material Theming. Find CSS variables, theme service APIs, and implementation guides for Angular Material theming.',
      url: this._router.url,
    });

  }

}//Cls
