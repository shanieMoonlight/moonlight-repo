import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AppImages3 } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';

@Component({
  selector: 'rd-main-categories',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainCategoriesComponent {

  protected _title = 'Product Categories';
  protected _subtitle = 'Checkout our product categories';
  protected _description = `This section allows the public to view our products categories.`;
  protected _heroImageUrl = AppImages3.Logo.small
  protected _heroImageAlt = 'Product Management';

  
  protected _mainAboutRoute=   AppRouteDefs.fullPathsWithSlash.main.route('about')
  protected _mainContactRoute= AppRouteDefs.fullPathsWithSlash.main.route('contact')
  protected _homeRoute = AppRouteDefs.fullPathsWithSlash.main.route();

}
