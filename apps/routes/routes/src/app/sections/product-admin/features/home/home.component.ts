import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppImages } from '../../../../config/images';
import { ProdAdminRoutes } from '../../config/prod-admin-route-data';
import { AdminNavCardComponent } from '../../../../shared/ui/admin-nav-card/admin-nav-card.component';

//##############################################//

@Component({
  selector: 'rd-prod-admin-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [AdminNavCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdminHomeComponent  {

  _title = 'Product Admin Home';
  _subtitle = 'Manage your products and orders';
  _description = `This is a more detailed description of your application's purpose and main features.`;
  _heroImageUrl = AppImages.Logo.default;
  _heroImageAlt = 'Route Defs Demo Logo';

  _prodAdminRoutes = ProdAdminRoutes

  //- - - - - - - - - - - - - - -//


}
