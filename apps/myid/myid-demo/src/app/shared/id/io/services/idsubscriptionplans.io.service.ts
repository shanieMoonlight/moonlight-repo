import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';
import {
  SubscriptionPlanDto,
  SubscriptionPlanDtoPagedResponse,
  PagedRequest,
  AddFeatureToPlanDto,
  AddFeaturesToPlanDto,
  RemoveFeatureFromSubscriptionPlanDto,
  RemoveFeaturesFromSubscriptionPlanDto,
} from '../models';

@Injectable({ providedIn: 'root' })
export class IdSubscriptionPlansIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.IdSubscriptionPlans.Controller);
  }

  add = (
    dto: SubscriptionPlanDto,
    opts?: unknown
  ): Observable<SubscriptionPlanDto> =>
    this._postAction<SubscriptionPlanDto>(
      ServerRoutes.IdSubscriptionPlans.action('add'),
      dto,
      opts ?? {}
    );

  edit = (
    dto: SubscriptionPlanDto,
    opts?: unknown
  ): Observable<SubscriptionPlanDto> =>
    this._patchAction<SubscriptionPlanDto>(
      ServerRoutes.IdSubscriptionPlans.action('edit'),
      dto,
      opts ?? {}
    );

  deleteById = (id: string, opts?: unknown): Observable<any> =>
    this._deleteAction<any>(
      ServerRoutes.IdSubscriptionPlans.action('delete'),
      [id],
      opts ?? {}
    );

  getAll = (opts?: unknown): Observable<SubscriptionPlanDto[]> =>
    this._getAction<SubscriptionPlanDto[]>(
      ServerRoutes.IdSubscriptionPlans.action('getAll'),
      opts ?? {}
    );

  getById = (id: string, opts?: unknown): Observable<SubscriptionPlanDto> =>
    this._getActionById<SubscriptionPlanDto>(
      ServerRoutes.IdSubscriptionPlans.action('get'),
      [id],
      opts ?? {}
    );

  getByName = (name: string, opts?: unknown): Observable<SubscriptionPlanDto> =>
    this._getActionById<SubscriptionPlanDto>(
      ServerRoutes.IdSubscriptionPlans.action('getByName'),
      [name],
      opts ?? {}
    );

  getAllByName = (
    name: string,
    opts?: unknown
  ): Observable<SubscriptionPlanDto[]> =>
    this._getActionById<SubscriptionPlanDto[]>(
      ServerRoutes.IdSubscriptionPlans.action('getAllByName'),
      [name],
      opts ?? {}
    );

  page = (
    dto: PagedRequest,
    opts?: unknown
  ): Observable<SubscriptionPlanDtoPagedResponse> =>
    this._postAction<SubscriptionPlanDtoPagedResponse>(
      ServerRoutes.IdSubscriptionPlans.action('page'),
      dto,
      opts ?? {}
    );

  addFeature = (
    dto: AddFeatureToPlanDto,
    opts?: unknown
  ): Observable<SubscriptionPlanDto> =>
    this._postAction<SubscriptionPlanDto>(
      ServerRoutes.IdSubscriptionPlans.action('addFeature'),
      dto,
      opts ?? {}
    );

  addFeatures = (
    dto: AddFeaturesToPlanDto,
    opts?: unknown
  ): Observable<SubscriptionPlanDto> =>
    this._postAction<SubscriptionPlanDto>(
      ServerRoutes.IdSubscriptionPlans.action('addFeatures'),
      dto,
      opts ?? {}
    );

  removeFeature = (
    dto: RemoveFeatureFromSubscriptionPlanDto,
    opts?: unknown
  ): Observable<SubscriptionPlanDto> =>
    this._postAction<SubscriptionPlanDto>(
      ServerRoutes.IdSubscriptionPlans.action('removeFeature'),
      dto,
      opts ?? {}
    );

  removeFeatures = (
    dto: RemoveFeaturesFromSubscriptionPlanDto,
    opts?: unknown
  ): Observable<SubscriptionPlanDto> =>
    this._postAction<SubscriptionPlanDto>(
      ServerRoutes.IdSubscriptionPlans.action('removeFeatures'),
      dto,
      opts ?? {}
    );
}
