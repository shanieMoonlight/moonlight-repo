import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';
import {
  TeamDto,
  AddCustomerMember_MntcDto,
  UpdateTeamPositionRangeDto,
  MessageResponseDto,
  TeamDtoPagedResponse,
  PagedRequest,
  AddTeamSubscriptionDto,
  SubscriptionDto,
  RemoveTeamSubscriptionDto,
  RecordSubscriptionPaymentDto,
  DeviceDto,
  AddDeviceToTeamDto,
  RemoveDeviceFromTeamSubscriptionDto,
} from '../models';

@Injectable({ providedIn: 'root' })
export class TeamsIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.Teams.Controller);
  }

  addCustomerToTeam = (
    dto: AddCustomerMember_MntcDto,
    opts?: unknown
  ): Observable<TeamDto> =>
    this._postAction<TeamDto>(
      ServerRoutes.Teams.action('addCustomerToTeam'),
      dto,
      opts ?? {}
    );

  add = (dto: TeamDto, opts?: unknown): Observable<TeamDto> =>
    this._postAction<TeamDto>(
      ServerRoutes.Teams.action('add'),
      dto,
      opts ?? {}
    );

  edit = (dto: TeamDto, opts?: unknown): Observable<TeamDto> =>
    this._patchAction<TeamDto>(
      ServerRoutes.Teams.action('edit'),
      dto,
      opts ?? {}
    );

  updatePositionRange = (
    dto: UpdateTeamPositionRangeDto,
    opts?: unknown
  ): Observable<TeamDto> =>
    this._patchAction<TeamDto>(
      ServerRoutes.Teams.action('updatePositionRange'),
      dto,
      opts ?? {}
    );

  deleteById = (id: string, opts?: unknown): Observable<MessageResponseDto> =>
    this._deleteAction<MessageResponseDto>(
      ServerRoutes.Teams.action('delete'),
      [id],
      opts ?? {}
    );

  getAll = (opts?: unknown): Observable<TeamDto> =>
    this._getAction<TeamDto>(ServerRoutes.Teams.action('getAll'), opts ?? {});

  getSuper = (opts?: unknown): Observable<TeamDto> =>
    this._getAction<TeamDto>(ServerRoutes.Teams.action('getSuper'), opts ?? {});

  getMntc = (opts?: unknown): Observable<TeamDto> =>
    this._getAction<TeamDto>(ServerRoutes.Teams.action('getMntc'), opts ?? {});

  getById = (id: string, opts?: unknown): Observable<TeamDto> =>
    this._getActionById<TeamDto>(
      ServerRoutes.Teams.action('get'),
      [id],
      opts ?? {}
    );

  getAllByName = (name: string, opts?: unknown): Observable<TeamDto[]> =>
    this._getActionById<TeamDto[]>(
      ServerRoutes.Teams.action('getAllByName'),
      [name],
      opts ?? {}
    );

  page = (
    dto: PagedRequest,
    opts?: unknown
  ): Observable<TeamDtoPagedResponse> =>
    this._postAction<TeamDtoPagedResponse>(
      ServerRoutes.Teams.action('page'),
      dto,
      opts ?? {}
    );

  addSubscription = (
    dto: AddTeamSubscriptionDto,
    opts?: unknown
  ): Observable<TeamDto> =>
    this._postAction<TeamDto>(
      ServerRoutes.Teams.action('addSubscription'),
      dto,
      opts ?? {}
    );

  getSubscriptionBySubId = (
    subId: string,
    opts?: unknown
  ): Observable<SubscriptionDto> =>
    this._getActionById<SubscriptionDto>(
      ServerRoutes.Teams.action('getSubscription'),
      [subId],
      opts ?? {}
    );

  removeSubscription = (
    dto: RemoveTeamSubscriptionDto,
    opts?: unknown
  ): Observable<TeamDto> =>
    this._postAction<TeamDto>(
      ServerRoutes.Teams.action('removeSubscription'),
      dto,
      opts ?? {}
    );

  recordSubscriptionPayment = (
    dto: RecordSubscriptionPaymentDto,
    opts?: unknown
  ): Observable<TeamDto> =>
    this._postAction<TeamDto>(
      ServerRoutes.Teams.action('recordSubscriptionPayment'),
      dto,
      opts ?? {}
    );

  getDeviceBySubIdAndDvcId = (
    subId: string,
    dvcId: string,
    opts?: unknown
  ): Observable<DeviceDto> =>
    this._getActionById<DeviceDto>(
      ServerRoutes.Teams.action('getDevice'),
      [subId, dvcId],
      opts ?? {}
    );

  addDevice = (
    dto: AddDeviceToTeamDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Teams.action('addDevice'),
      dto,
      opts ?? {}
    );

  removeDevice = (
    dto: RemoveDeviceFromTeamSubscriptionDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._postAction<MessageResponseDto>(
      ServerRoutes.Teams.action('removeDevice'),
      dto,
      opts ?? {}
    );

  updateDevice = (
    dto: DeviceDto,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._patchAction<MessageResponseDto>(
      ServerRoutes.Teams.action('updateDevice'),
      dto,
      opts ?? {}
    );
}
