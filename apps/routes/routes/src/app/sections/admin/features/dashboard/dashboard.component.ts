import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AppImages5 } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';

@Component({
  selector: 'rd-admin-dashboard',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {

  protected _title = 'Dashboard';
  protected _subtitle = 'Overview of key metrics and summary data';
  protected _description = `This section provides an overview of the application's key metrics and summary data.`;
  protected _heroImageUrl = AppImages5.Logo.small
  protected _heroImageAlt = 'Dashboard Overview';


  //Not calling from base admin so need to use full path
  protected _homeRoute = `/${AppRouteDefs.fullPaths.admin.route('home')}`;

}
