import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { MAIN_ROUTES } from '../../config/route-data';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';

//##############################################//

interface Feature {
  title: string;
  description: string;
  route: string;
  icon: string;
}

//##############################################//

@Component({
  selector: 'rd-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatEverythingModule,
    HeroBannerComponent,
    HighlightModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  protected _title = 'Route Defs Demo';
  protected _subtitle = 'Concise description of what this application does';
  protected _description = `Understaning how to deal with complex routes in an Angular application.`;
  protected _heroImageUrl = AppImages.Logo.default;
  protected _heroImageAlt = 'Route Defs Demo Logo';

  protected _features = MAIN_ROUTES
  protected _gitUrl = AppConstants.GIT_REP_URL

  protected _aboutRoute =    `/${AppRouteDefs.fullPaths.main.route('about')}`;
  protected _contactRoute =  `/${AppRouteDefs.fullPaths.main.route('contact')}`;
  protected _productsRoute = `/${AppRouteDefs.fullPaths.main.route('products')}`;
  

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: 'Route Defs Demo | Demonstarating Complex Angular Routing',
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Routing', 'Angular library'],
    });
  }
}
