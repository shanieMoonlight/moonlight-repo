import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { AppImages3 } from '../../../../config/images';
import { AppRouteDefs } from '../../../../app-route-defs';

@Component({
  selector: 'rd-prod-admin-new-product',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdminNewProductComponent {

  protected _title = 'New Product';
  protected _subtitle = 'Create and manage new products';
  protected _description = `This section allows you to create and manage new products efficiently.`;
  protected _heroImageUrl = AppImages3.Logo.small
  protected _heroImageAlt = 'Product Management';

  protected _mainProductsRoute=   AppRouteDefs.fullPathsWithSlash.main.route('products')
  //Not calling from base products-admin so Not needto use full path
  protected _prodAdminHomeRoute = AppRouteDefs.fullPathsWithSlash.admin.products.route('home')
}
