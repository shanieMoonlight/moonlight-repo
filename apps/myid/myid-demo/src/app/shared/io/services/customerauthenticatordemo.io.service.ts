import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';

@Injectable({ providedIn: 'root' })
export class CustomerAuthenticatorDemoIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.CustomerAuthenticatorDemo.Controller);
  }

  customer = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.CustomerAuthenticatorDemo.action('customer'),
      opts ?? {}
    );

  customerMinimum = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.CustomerAuthenticatorDemo.action('customerMinimum'),
      opts ?? {}
    );

  customerLeader = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.CustomerAuthenticatorDemo.action('customerLeader'),
      opts ?? {}
    );

  customerLeaderMinimum = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.CustomerAuthenticatorDemo.action('customerLeaderMinimum'),
      opts ?? {}
    );

  customerResourceFilter = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.CustomerAuthenticatorDemo.action('customerResourceFilter'),
      opts ?? {}
    );
}
