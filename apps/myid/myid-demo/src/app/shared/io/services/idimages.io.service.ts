import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';
import { MessageResponseDto } from '../models';

@Injectable({ providedIn: 'root' })
export class IdImagesIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.IdImages.Controller);
  }

  emailConfirmed = (opts?: unknown): Observable<MessageResponseDto> =>
    this._getAction<MessageResponseDto>(
      ServerRoutes.IdImages.action('emailConfirmed'),
      opts ?? {}
    );

  phoneConfirmed = (opts?: unknown): Observable<MessageResponseDto> =>
    this._getAction<MessageResponseDto>(
      ServerRoutes.IdImages.action('phoneConfirmed'),
      opts ?? {}
    );

  fallbackLogo = (opts?: unknown): Observable<MessageResponseDto> =>
    this._getAction<MessageResponseDto>(
      ServerRoutes.IdImages.action('fallbackLogo'),
      opts ?? {}
    );
}
