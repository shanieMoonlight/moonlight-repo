import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { AppImages4 } from '../../../../config/images';

@Component({
  selector: 'rd-reports',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {

  protected _title = 'Reports';
  protected _subtitle = 'View analytics and generate reports';
  protected _description = `This section provides tools to view analytics, statistics, and generate data reports.`;
  protected _heroImageUrl = AppImages4.Logo.small
  protected _heroImageAlt = 'Reports and Analytics';

}
