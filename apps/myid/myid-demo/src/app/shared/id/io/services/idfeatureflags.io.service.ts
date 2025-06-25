import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';
import {
  FeatureFlagDto,
  FeatureFlagDtoPagedResponse,
  PagedRequest,
} from '../models';

@Injectable({ providedIn: 'root' })
export class IdFeatureFlagsIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.IdFeatureFlags.Controller);
  }

  add = (dto: FeatureFlagDto, opts?: unknown): Observable<FeatureFlagDto> =>
    this._postAction<FeatureFlagDto>(
      ServerRoutes.IdFeatureFlags.action('add'),
      dto,
      opts ?? {}
    );

  edit = (dto: FeatureFlagDto, opts?: unknown): Observable<FeatureFlagDto> =>
    this._patchAction<FeatureFlagDto>(
      ServerRoutes.IdFeatureFlags.action('edit'),
      dto,
      opts ?? {}
    );

  deleteById = (id: string, opts?: unknown): Observable<FeatureFlagDto> =>
    this._deleteAction<FeatureFlagDto>(
      ServerRoutes.IdFeatureFlags.action('delete'),
      [id],
      opts ?? {}
    );

  getAll = (opts?: unknown): Observable<FeatureFlagDto[]> =>
    this._getAction<FeatureFlagDto[]>(
      ServerRoutes.IdFeatureFlags.action('getAll'),
      opts ?? {}
    );

  getById = (id: string, opts?: unknown): Observable<FeatureFlagDto> =>
    this._getActionById<FeatureFlagDto>(
      ServerRoutes.IdFeatureFlags.action('get'),
      [id],
      opts ?? {}
    );

  getAllByName = (name: string, opts?: unknown): Observable<FeatureFlagDto[]> =>
    this._getActionById<FeatureFlagDto[]>(
      ServerRoutes.IdFeatureFlags.action('getAllByName'),
      [name],
      opts ?? {}
    );

  getByName = (name: string, opts?: unknown): Observable<FeatureFlagDto[]> =>
    this._getActionById<FeatureFlagDto[]>(
      ServerRoutes.IdFeatureFlags.action('getByName'),
      [name],
      opts ?? {}
    );

  page = (
    dto: PagedRequest,
    opts?: unknown
  ): Observable<FeatureFlagDtoPagedResponse> =>
    this._postAction<FeatureFlagDtoPagedResponse>(
      ServerRoutes.IdFeatureFlags.action('page'),
      dto,
      opts ?? {}
    );
}
