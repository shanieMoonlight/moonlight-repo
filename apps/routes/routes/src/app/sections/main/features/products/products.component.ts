import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AppImages3 } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';

@Component({
  selector: 'rd-main-products',
  standalone: true,
  imports: [
    HeroBannerComponent,
    RouterModule,
    MatEverythingModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainProductsComponent {

  protected _title = 'Products';
  protected _subtitle = 'Explore our innovative solutions';
  protected _description = `Browse our comprehensive catalog of products designed to meet your needs. From enterprise solutions to personal tools, we offer high-quality software with cutting-edge features and outstanding support.`;
  protected _heroImageUrl = AppImages3.Logo.small;
  protected _heroImageAlt = 'Route Defs Demo Logo';
  
  protected _homeRoute = AppRouteDefs.fullPathsWithSlash.main.route();

}
