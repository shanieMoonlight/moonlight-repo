import { ChangeDetectionStrategy, Component, inject, OnInit, signal, } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { AppImages } from '../../../../config/images';
import { AdminNavCardComponent } from '../../ui/nav-card/admin-nav-card.component';
import { AdminRoutes } from '../../config/admin-route-data';

//##############################################//

@Component({
  selector: 'rd-admin-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [AdminNavCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  _adminRoutes = signal(AdminRoutes);

  _title = 'SpiderBaby SbRouteDefsDemo Docs';
  _subtitle = 'Comprehensive documentation and guides SbRouteDefsDemo system';
  _description = `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`;
  _heroImageUrl = AppImages.Logo.default;
  _heroImageAlt = 'SbRouteDefsDemo Logo';

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'API SbRouteDefsDemo | more information about the API',
      description: this._description,
      url: this._router.url,
      keywords: ['API', 'Angular', 'Angular library'],
    });
  }
}
