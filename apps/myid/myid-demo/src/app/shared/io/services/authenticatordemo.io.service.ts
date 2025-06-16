import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';

@Injectable({ providedIn: 'root' })
export class AuthenticatorDemoIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.AuthenticatorDemo.Controller);
  }

  endpoints = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.AuthenticatorDemo.action('endpoints'),
      opts ?? {}
    );

  testInfo = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.AuthenticatorDemo.action('testInfo'),
      opts ?? {}
    );
}
