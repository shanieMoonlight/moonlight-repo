import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AppImages2 } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';

@Component({
  selector: 'rd-main-about',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainAboutComponent {


  protected _title = 'About Us';
  protected _subtitle = 'Your trusted partner in web development solutions';
  protected _description = `Founded in 2020, our company specializes in creating modern, efficient, and user-friendly web applications using the latest technologies like Angular, React, and Node.js. Our team of experienced developers is dedicated to delivering high-quality solutions for businesses of all sizes.`;
  protected _heroImageUrl = AppImages2.Logo.small;
  protected _heroImageAlt = 'Route Defs Demo Logo';

  
  protected _homeRoute = AppRouteDefs.fullPathsWithSlash.main.route();

}
