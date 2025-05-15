import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { AppImages2 } from '../../../../config/images';
import { AppRouteDefs } from '../../../../app-route-defs';

@Component({
  selector: 'rd-admin-settings',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {

  protected _title = 'Settings';
  protected _subtitle = 'Configure application preferences';
  protected _description = `This section allows you to configure application settings and system preferences.`;
  protected _heroImageUrl = AppImages2.Logo.small
  protected _heroImageAlt = 'Application Settings';

  protected _mainAboutRoute = `/${AppRouteDefs.fullPaths.main.route('about')}`;
  protected _mainContactRoute = `/${AppRouteDefs.fullPaths.main.route('contact')}`;
  
  //Not calling from base admin so need to use full path
  protected _homeRoute = `/${AppRouteDefs.fullPaths.admin.route('home')}`;

}
