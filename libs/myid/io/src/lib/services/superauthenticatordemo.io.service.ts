import { inject, Injectable } from '@angular/core';
import { MyIdIoConfigService } from '@spider-baby/myid-io/config';
import { Observable } from 'rxjs';
import { ServerRoutes } from '../controllers/all-server-routes';
import { AServerIoService } from './base/base-server-io.service';

@Injectable({ providedIn: 'root' })
export class SuperAuthenticatorDemoIoService extends AServerIoService {
  constructor() {
    super(inject(MyIdIoConfigService).baseUrl, ServerRoutes.SuperAuthenticatorDemo.Controller);
  }

  super = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('super'),
      opts ?? {}
    );

  superMinimum = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('super-minimum'),
      opts ?? {}
    );

  superLeader = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('super-leader'),
      opts ?? {}
    );

  superMinimumOrDev = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('super-minimum-or-dev'),
      opts ?? {}
    );

  superResourceFilter = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('super-resource-filter'),
      opts ?? {}
    );
}
