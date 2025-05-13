import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { SbMatApiNavCardComponent } from '@spider-baby/ui-cards/api';
import { SeoService } from '@spider-baby/utils-seo';
import { AppImages } from '../../../../config/images';
import { API_ROUTES } from '../../config/route-data';

//##############################################//

@Component({
  selector: 'sb-api-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [SbMatApiNavCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiHomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  _apiRoutes = signal(API_ROUTES);

  _title = 'SpiderBaby Spider-Baby Docs';
  _subtitle = 'Comprehensive documentation and guides SpiderBabyHub system';
  _description = `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`;
  _heroImageUrl = AppImages.Logo.default;
  _heroImageAlt = 'Spider-Baby Logo';

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'API Spider-Baby | more information about the API',
      description: this._description,
      url: this._router.url,
      keywords: ['API', 'Angular', 'Angular library'],
    });
  }
}
