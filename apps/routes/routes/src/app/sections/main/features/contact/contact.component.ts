import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AppImages1 } from '../../../../config/images';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';

@Component({
  selector: 'rd-main-contact',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContactComponent {


  protected _title = 'Contact us';protected _subtitle = 'Get in touch with our team';
  protected _description = `Have questions or need assistance? Our dedicated support team is here to help. Fill out the contact form below or reach out to us directly using the information provided.`;
  protected _heroImageUrl = AppImages1.Logo.small;
  protected _heroImageAlt = 'Route Defs Demo Logo';

  
  protected _homeRoute = AppRouteDefs.fullPathsWithSlash.main.route();

}
