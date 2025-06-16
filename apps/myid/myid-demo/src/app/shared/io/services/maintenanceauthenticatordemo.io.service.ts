import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';

@Injectable({ providedIn: 'root' })
export class MaintenanceAuthenticatorDemoIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.MaintenanceAuthenticatorDemo.Controller);
  }

  mntc = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntc'),
      opts ?? {}
    );

  mntcMinimum = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntcMinimum'),
      opts ?? {}
    );

  mntcLeader = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntcLeader'),
      opts ?? {}
    );

  mntcLeaderMinimum = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntcLeaderMinimum'),
      opts ?? {}
    );

  mntcMinimumOrDev = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntcMinimumOrDev'),
      opts ?? {}
    );

  mntcResourceFilter = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MaintenanceAuthenticatorDemo.action('mntcResourceFilter'),
      opts ?? {}
    );
}
