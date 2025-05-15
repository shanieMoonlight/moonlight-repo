import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { AppImages3 } from '../../../../config/images';

@Component({
  selector: 'rd-categories',
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
export class ProductCategoriesComponent {

  protected _title = 'New Product';
  protected _subtitle = 'Create and manage new products';
  protected _description = `This section allows you to create and manage new products efficiently.`;
  protected _heroImageUrl = AppImages3.Logo.small
  protected _heroImageAlt = 'Product Management';

}
