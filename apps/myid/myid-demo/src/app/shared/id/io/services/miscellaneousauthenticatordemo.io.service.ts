import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';

@Injectable({ providedIn: 'root' })
export class MiscellaneousAuthenticatorDemoIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.MiscellaneousAuthenticatorDemo.Controller);
  }

  leader = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MiscellaneousAuthenticatorDemo.action('leader'),
      opts ?? {}
    );

  positionMinimum = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MiscellaneousAuthenticatorDemo.action('position-minimum'),
      opts ?? {}
    );

  positionMinimumWithLevel = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MiscellaneousAuthenticatorDemo.action(
        'position-minimum-with-level'
      ),
      opts ?? {}
    );

  positionMinimumResourceFilter = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MiscellaneousAuthenticatorDemo.action(
        'position-minimum-resource-filter'
      ),
      opts ?? {}
    );

  leaderResourceFilter = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MiscellaneousAuthenticatorDemo.action(
        'leader-resource-filter'
      ),
      opts ?? {}
    );

  policyExample = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.MiscellaneousAuthenticatorDemo.action('policy-example'),
      opts ?? {}
    );
}
