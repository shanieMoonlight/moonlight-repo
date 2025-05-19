import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubAppRouteDefs } from "@sb-hub/app/route-definitions";
import { DEMO_APPS } from '@sb-hub/core-config/demo-apps';
import { HubAppImages } from '@sb-hub/core-config/images';
import { HubOpenSourceDemoCardComponent } from '@sb-hub/sections-main/features/open-source/card';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HubUiFancyNavCardComponent } from '@sb-hub/ui-cards/fancy-nav'; // Import the new card component

@Component({
  selector: 'hub-open-source-demos',
  imports: [
    MatEverythingModule,
    HubOpenSourceDemoCardComponent,
    HubUiFancyNavCardComponent
  ],
  templateUrl: './demos.component.html',
  styleUrl: './demos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubOpenSourceDemosComponent {

  protected _demoApps = signal(DEMO_APPS)

  protected _logo = signal(HubAppImages.Logo.small)


  /**
   *
   */
  constructor() {

    // console.log(`HubAppRouteDefs.routes                 :`, HubAppRouteDefs.routes);

    console.log(`HubAppRouteDefs.routes.main.route()                 :`, HubAppRouteDefs.routes.main.route());
    console.log(`HubAppRouteDefs.fullPaths.main.route()              :`, HubAppRouteDefs.fullPaths.main.route());

    console.log(`HubAppRouteDefs.routes.main.route('home')           :`, HubAppRouteDefs.routes.main.route('home'));
    console.log(`HubAppRouteDefs.fullPaths.main.route('home')        :`, HubAppRouteDefs.fullPaths.main.route('home'));

    console.log(`HubAppRouteDefs.routes.main.route('open-source')    :`, HubAppRouteDefs.routes.main.route('open-source'));
    console.log(`HubAppRouteDefs.fullPaths.main.route('open-source') :`, HubAppRouteDefs.fullPaths.main.route('open-source'));

    // console.log(`HubAppRouteDefs.routes.main.admin.route()            :`, HubAppRouteDefs.routes.main.admin.route());
    // console.log(`HubAppRouteDefs.fullPaths.main.admin.route()         :`, HubAppRouteDefs.fullPaths.main.admin.route());

    // console.log(`HubAppRouteDefs.routes.main.admin.route('users')     :`, HubAppRouteDefs.routes.main.admin.route('users'));
    // console.log(`HubAppRouteDefs.fullPaths.main.admin.route('users')  :`, HubAppRouteDefs.fullPaths.main.admin.route('users'));



  }




}
