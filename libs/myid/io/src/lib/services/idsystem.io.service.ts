import { inject, Injectable } from '@angular/core';
import { MyIdIoConfigService } from '@spider-baby/myid-io/config';
import {
  EmailRoutesDto,
  InitializeDto,
  MessageResponseDto,
  PublicSigningKeyDto,
  SettingsDto,
} from '@spider-baby/myid-io/models';
import { Observable } from 'rxjs';
import { ServerRoutes } from '../controllers/all-server-routes';
import { AServerIoService } from './base/base-server-io.service';

@Injectable({ providedIn: 'root' })
export class IdSystemIoService extends AServerIoService {
  constructor() {
    super(inject(MyIdIoConfigService).baseUrl, ServerRoutes.IdSystem.Controller);
  }

  initialize = (
    dto: InitializeDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.IdSystem.action('initialize'),
      dto,
      opts ?? {}
    );

  migrate = (opts?: unknown): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.IdSystem.action('migrate'),
      opts ?? {}
    );

  publicSigningKey = (opts?: unknown): Observable<PublicSigningKeyDto> =>
    this._getAction<PublicSigningKeyDto>(
      ServerRoutes.IdSystem.action('publicSigningKey'),
      opts ?? {}
    );

  emailRoutes = (opts?: unknown): Observable<EmailRoutesDto> =>
    this._getAction<EmailRoutesDto>(
      ServerRoutes.IdSystem.action('emailRoutes'),
      opts ?? {}
    );

  getTwoFactorProviders = (opts?: unknown): Observable<any> =>
    this._getAction<any>(
      ServerRoutes.IdSystem.action('getTwoFactorProviders'),
      opts ?? {}
    );

  globalSettings = (opts?: unknown): Observable<SettingsDto> =>
    this._getAction<SettingsDto>(
      ServerRoutes.IdSystem.action('globalSettings'),
      opts ?? {}
    );
}
