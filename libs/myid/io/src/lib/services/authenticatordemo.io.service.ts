import { inject, Injectable } from '@angular/core';
import { MyIdIoConfigService } from '@spider-baby/myid-io/config';
import { Observable } from 'rxjs';
import { ServerRoutes } from '../controllers/all-server-routes';
import { AServerIoService } from './base/base-server-io.service';

@Injectable({ providedIn: 'root' })
export class AuthenticatorDemoIoService extends AServerIoService {
  constructor() {
    super(inject(MyIdIoConfigService).baseUrl, ServerRoutes.AuthenticatorDemo.Controller);
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
