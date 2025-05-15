import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HighlightModule } from 'ngx-highlightjs';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { MainRoutes } from '../../config/route-data';
import { MainSectionRoutesDefs } from '../../main-route-defs';
import { NavCardComponent } from "../../../../shared/ui/nav-card/nav-card.component";

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
    NavCardComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHomeComponent {

  protected _title = 'Route Defs Demo';
  protected _subtitle = 'Concise description of what this application does';
  protected _description = `Understaning how to deal with complex routes in an Angular application.`;
  protected _heroImageUrl = AppImages.Logo.default;
  protected _heroImageAlt = 'Route Defs Demo Logo';

  protected _mainRoutes = MainRoutes
  protected _gitUrl = AppConstants.GIT_REP_URL

  //Calling from base main so can use relative path
  protected _aboutRoute =    MainSectionRoutesDefs.route('about')
  protected _contactRoute =  MainSectionRoutesDefs.route('contact')
  protected _productsRoute = MainSectionRoutesDefs.route('products')


}
