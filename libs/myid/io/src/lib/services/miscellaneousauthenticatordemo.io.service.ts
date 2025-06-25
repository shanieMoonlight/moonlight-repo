import { inject, Injectable } from '@angular/core';
import { MyIdIoConfigService } from '@spider-baby/myid-io/config';
import { Observable } from 'rxjs';
import { ServerRoutes } from '../controllers/all-server-routes';
import { AServerIoService } from './base/base-server-io.service';

@Injectable({ providedIn: 'root' })
export class MiscellaneousAuthenticatorDemoIoService extends AServerIoService {
  constructor() {
    super(inject(MyIdIoConfigService).baseUrl, ServerRoutes.MiscellaneousAuthenticatorDemo.Controller);
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
