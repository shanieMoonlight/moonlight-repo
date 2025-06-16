import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';

@Injectable({ providedIn: 'root' })
export class SuperAuthenticatorDemoIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.SuperAuthenticatorDemo.Controller);
  }

  super = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('super'),
      opts ?? {}
    );

  superMinimum = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('superMinimum'),
      opts ?? {}
    );

  superLeader = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('superLeader'),
      opts ?? {}
    );

  superMinimumOrDev = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('superMinimumOrDev'),
      opts ?? {}
    );

  superResourceFilter = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.SuperAuthenticatorDemo.action('superResourceFilter'),
      opts ?? {}
    );
}
