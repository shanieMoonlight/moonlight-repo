import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEMO_APPS } from '@sb-hub/core-config/demo-apps';
import { HubAppImages } from '@sb-hub/core-config/images';
import { HubSharedUiFooterComponent } from '@sb-hub/shared-ui/footer';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { HubUiFancyNavCardComponent } from '@sb-hub/ui-cards/fancy-nav';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
@Component({
  selector: 'hub-open-source-demos',
  imports: [
    MatEverythingModule,
    HubUiFancyNavCardComponent,
    HubHeroBanner2Component,
    HubSharedUiFooterComponent
  ],
  templateUrl: './demos.component.html',
  styleUrl: './demos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubOpenSourceDemosComponent {


  
  protected _title = 'Open Source';
  protected _subtitle = 'Explore our collection of demo applications for our open source projects and packages';
  protected _description = ``;


  protected _demoApps = DEMO_APPS

  protected _logo = HubAppImages.Logo.small
  protected _openSourceImg = HubAppImages.Main.OpenSource.xLarge
  protected _openSourceImgPlaceholder = HubAppImages.Main.OpenSource.placeholder







}
