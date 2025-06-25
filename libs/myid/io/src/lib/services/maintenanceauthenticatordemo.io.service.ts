import { inject, Injectable } from '@angular/core';
import { MyIdIoConfigService } from '@spider-baby/myid-io/config';
import { Observable } from 'rxjs';
import { ServerRoutes } from '../controllers/all-server-routes';
import { AServerIoService } from './base/base-server-io.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceAuthenticatorDemoIoService extends AServerIoService {
  constructor() {
    super(inject(MyIdIoConfigService).baseUrl, ServerRoutes.MaintenanceAuthenticatorDemo.Controller);
  }

  mntc = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntc'),
      opts ?? {}
    );

  mntcMinimum = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntc-minimum'),
      opts ?? {}
    );

  mntcLeader = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntc-leader'),
      opts ?? {}
    );

  mntcLeaderMinimum = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntc-leader-minimum'),
      opts ?? {}
    );

  mntcMinimumOrDev = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntc-minimum-or-dev'),
      opts ?? {}
    );

  mntcResourceFilter = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntc-resource-filter'),
      opts ?? {}
    );
}
