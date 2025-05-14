import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubAppRouteDefs } from "@sb-hub/app/route-definitions";
import { DEMO_APPS } from '@sb-hub/core-config/demo-apps';
import { HubOpenSourceDemoCardComponent } from '@sb-hub/sections-main/features/open-source/card';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';

@Component({
  selector: 'hub-open-source-demos',
  imports: [
    MatEverythingModule,
    HubOpenSourceDemoCardComponent
  ],
  templateUrl: './demos.component.html',
  styleUrl: './demos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubOpenSourceDemosComponent {

  protected _demoApps = signal(DEMO_APPS)

  _appRouteDefs = HubAppRouteDefs

  _homePath = this._appRouteDefs.fullPaths.main.route('home')
  _homePath2 = this._appRouteDefs.routes.main.route('home')


  /**
   *
   */
  constructor() {

    // console.log(`this._appRouteDefs.routes                 :`, this._appRouteDefs.routes);

    console.log(`this._appRouteDefs.routes.main.route()                 :`, this._appRouteDefs.routes.main.route());
    console.log(`this._appRouteDefs.fullPaths.main.route()              :`, this._appRouteDefs.fullPaths.main.route());

    console.log(`this._appRouteDefs.routes.main.route('home')           :`, this._appRouteDefs.routes.main.route('home'));
    console.log(`this._appRouteDefs.fullPaths.main.route('home')        :`, this._appRouteDefs.fullPaths.main.route('home'));

    console.log(`this._appRouteDefs.routes.main.route('open-source')    :`, this._appRouteDefs.routes.main.route('open-source'));
    console.log(`this._appRouteDefs.fullPaths.main.route('open-source') :`, this._appRouteDefs.fullPaths.main.route('open-source'));

    // console.log(`this._appRouteDefs.routes.main.admin.route()            :`, this._appRouteDefs.routes.main.admin.route());
    // console.log(`this._appRouteDefs.fullPaths.main.admin.route()         :`, this._appRouteDefs.fullPaths.main.admin.route());

    // console.log(`this._appRouteDefs.routes.main.admin.route('users')     :`, this._appRouteDefs.routes.main.admin.route('users'));
    // console.log(`this._appRouteDefs.fullPaths.main.admin.route('users')  :`, this._appRouteDefs.fullPaths.main.admin.route('users'));



  }




}
