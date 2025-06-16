import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';
import {
  IdOutboxMessageDto,
  IdOutboxMessageDtoPagedResponse,
  PagedRequest,
} from '../models';

@Injectable({ providedIn: 'root' })
export class IdOutboxMessagesIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.IdOutboxMessages.Controller);
  }

  getAll = (opts?: unknown): Observable<IdOutboxMessageDto[]> =>
    this._getAction<IdOutboxMessageDto[]>(
      ServerRoutes.IdOutboxMessages.action('getAll'),
      opts ?? {}
    );

  getById = (id: string, opts?: unknown): Observable<IdOutboxMessageDto> =>
    this._getActionById<IdOutboxMessageDto>(
      ServerRoutes.IdOutboxMessages.action('get'),
      [id],
      opts ?? {}
    );

  getAllByTypeByName = (
    name: string,
    opts?: unknown
  ): Observable<IdOutboxMessageDto[]> =>
    this._getActionById<IdOutboxMessageDto[]>(
      ServerRoutes.IdOutboxMessages.action('getAllByType'),
      [name],
      opts ?? {}
    );

  page = (
    dto: PagedRequest,
    opts?: unknown
  ): Observable<IdOutboxMessageDtoPagedResponse> =>
    this._postAction<IdOutboxMessageDtoPagedResponse>(
      ServerRoutes.IdOutboxMessages.action('page'),
      dto,
      opts ?? {}
    );
}
