import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HighlightModule } from 'ngx-highlightjs';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { MainRoutes } from '../../config/route-data';

//##############################################//

@Component({
  selector: 'rd-main-home',
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
export class MainHomeComponent {

  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  protected _title = 'Route Defs Demo';
  protected _subtitle = 'Concise description of what this application does';
  protected _description = `Understaning how to deal with complex routes in an Angular application.`;
  protected _heroImageUrl = AppImages.Logo.default;
  protected _heroImageAlt = 'Route Defs Demo Logo';

  protected _features = MainRoutes
  protected _gitUrl = AppConstants.GIT_REP_URL

  protected _aboutRoute =    `/${AppRouteDefs.fullPaths.main.route('about')}`;
  protected _contactRoute =  `/${AppRouteDefs.fullPaths.main.route('contact')}`;
  protected _productsRoute = `/${AppRouteDefs.fullPaths.main.route('products')}`;


  //- - - - - - - - - - - - - - -//
}
