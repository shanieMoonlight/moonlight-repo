import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubAppRouteDefs } from "@sb-hub/app/route-definitions";
import { DEMO_APPS } from '@sb-hub/core-config/demo-apps';
import { HubAppImages } from '@sb-hub/core-config/images';
import { HubOpenSourceDemoCardComponent } from '@sb-hub/sections-main/features/open-source/card';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HubUiFancyNavCardComponent } from '@sb-hub/ui-cards/fancy-nav'; 
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
@Component({
  selector: 'hub-open-source-demos',
  imports: [
    MatEverythingModule,
    HubOpenSourceDemoCardComponent,
    HubUiFancyNavCardComponent,
    HubHeroBanner2Component
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







}
