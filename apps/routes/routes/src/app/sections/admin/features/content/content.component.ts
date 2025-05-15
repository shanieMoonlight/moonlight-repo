import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { AppImages3 } from '../../../../config/images';
import { AppRouteDefs } from '../../../../app-route-defs';

@Component({
  selector: 'rd-admin-content',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminContentComponent {

  protected _title = 'Content';
  protected _subtitle = 'Manage application content';
  protected _description = `This section allows you to manage website or application content efficiently.`;
  protected _heroImageUrl = AppImages3.Logo.small
  protected _heroImageAlt = 'Content Management';

  protected _mainAboutRoute=   `/${AppRouteDefs.fullPaths.main.route('about')}`;
  protected _mainContactRoute= `/${AppRouteDefs.fullPaths.main.route('contact')}`;
  //Not calling from base admin so need to use full path
  protected _homeRoute = `/${AppRouteDefs.fullPaths.admin.route('home')}`;

}
