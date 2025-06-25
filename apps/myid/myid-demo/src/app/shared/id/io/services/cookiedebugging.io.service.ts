import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';

@Injectable({ providedIn: 'root' })
export class CookieDebuggingIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.CookieDebugging.Controller);
  }

  cookieInfo = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.CookieDebugging.action('cookieInfo'),
      opts ?? {}
    );
}
