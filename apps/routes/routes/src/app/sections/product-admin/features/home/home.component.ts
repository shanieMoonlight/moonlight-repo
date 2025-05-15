import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppImages } from '../../../../config/images';
import { ProdAdminMainRoutes } from '../../config/prod-admin-main-route-data';
import { NavCardComponent } from '../../../../shared/ui/nav-card/nav-card.component';

//##############################################//

@Component({
  selector: 'rd-prod-admin-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [NavCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdminHomeComponent  {

  _title = 'Product Admin Home';
  _subtitle = 'Manage your products and orders';
  _description = `This is a separate sub-section with it's own routes.`;
  _heroImageUrl = AppImages.Logo.default;
  _heroImageAlt = 'Route Defs Demo Logo';

  _prodAdminRoutes = ProdAdminMainRoutes

  //- - - - - - - - - - - - - - -//


}
