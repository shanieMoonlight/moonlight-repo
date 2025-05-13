import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubAppRouteDefs } from "@sb-hub/app/route-defs";
import { DEMO_APPS } from '@sb-hub/core-config/demo-apps';
import { HubOpenSourceDemoCardComponent } from '@sb-hub/sections-main/features/open-source/card';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';

@Component({
  selector: 'hub-open-source-demos',
  imports: [MatEverythingModule, HubOpenSourceDemoCardComponent],
  templateUrl: './demos.component.html',
  styleUrl: './demos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubOpenSourceDemosComponent {

  protected _demoApps = signal(DEMO_APPS)

  _mainPath = HubAppRouteDefs.main.route()
  _homePath = HubAppRouteDefs.fullPaths.main.route('home')
  _homePath2 = HubAppRouteDefs.routes.main.route('home')

}
