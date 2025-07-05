import { inject, Injectable } from '@angular/core';
import { MyIdIoConfigService } from '@spider-baby/myid-io/config';
import { Observable } from 'rxjs';
import { ServerRoutes } from '../controllers/all-server-routes';
import { AServerIoService } from './base/base-server-io.service';

@Injectable({ providedIn: 'root' })
export class CookieDebuggingIoService extends AServerIoService {
 
  constructor() {
    super(inject(MyIdIoConfigService).baseUrl, ServerRoutes.CookieDebugging.Controller);
  }

  cookieInfo = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.CookieDebugging.action('cookieInfo'),
      opts ?? {}
    );
}
