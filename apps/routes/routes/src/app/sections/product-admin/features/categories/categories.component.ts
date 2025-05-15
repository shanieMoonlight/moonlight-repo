import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { AppImages3 } from '../../../../config/images';
import { AppRouteDefs } from '../../../../app-route-defs';

@Component({
  selector: 'rd-prod-admin-categories',
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
export class ProductAdminCategoriesComponent {

  protected _title = 'Product Categories';
  protected _subtitle = 'Create and manage product categories';
  protected _description = `This section allows you to create and manage product categories efficiently.`;
  protected _heroImageUrl = AppImages3.Logo.small
  protected _heroImageAlt = 'Product Management';

  
  protected _mainProductsRoute=   AppRouteDefs.fullPathsWithSlash.main.route('products')
  protected _mainCategoriesRoute=  AppRouteDefs.fullPathsWithSlash.main.route('categories')
  //Not calling from base products-admin so Not needto use full path
  protected _prodAdminHomeRoute = AppRouteDefs.fullPathsWithSlash.admin.products.route('home')

}
