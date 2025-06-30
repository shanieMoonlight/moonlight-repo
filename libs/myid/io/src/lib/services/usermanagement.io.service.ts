import { inject, Injectable } from '@angular/core';
import { MyIdIoConfigService } from '@spider-baby/myid-io/config';
import {
  AddCustomerMember_MntcDto,
  AddCustomerMemberDto,
  AddMntcMemberDto,
  AddSuperMemberDto,
  AppUser_Customer_Dto,
  AppUser_Customer_DtoPagedResponse,
  AppUserDto,
  AppUserDtoPagedResponse,
  IdentityAddressDto,
  MessageResponseDto,
  PagedRequest,
  TeamDto,
  UpdatePositionDto,
  UpdateSelfDto,
  UpdateTeamLeaderDto,
  UpdateTwoFactorProviderDto,
} from '@spider-baby/myid-io/models';
import { Observable } from 'rxjs';
import { ServerRoutes } from '../controllers/all-server-routes';
import { AServerIoService } from './base/base-server-io.service';

@Injectable({ providedIn: 'root' })
export class UserManagementIoService extends AServerIoService {
  constructor() {
    super(inject(MyIdIoConfigService).baseUrl, ServerRoutes.UserManagement.Controller);
  }

  addMntcTeamMember = (
    dto: AddMntcMemberDto,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._postAction<AppUserDto>(
      ServerRoutes.Account.action('addMntcTeamMember'),
      dto,
      opts ?? {}
    );

  addSuperTeamMember = (
    dto: AddSuperMemberDto,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._postAction<AppUserDto>(
      ServerRoutes.Account.action('addSuperTeamMember'),
      dto,
      opts ?? {}
    );


  addCustomerTeamMember = (
    dto: AddCustomerMemberDto,
    opts?: unknown
  ): Observable<AppUser_Customer_Dto> =>
    this._postAction<AppUser_Customer_Dto>(
      ServerRoutes.Account.action('addCustomerTeamMember'),
      dto,
      opts ?? {}
    );

  addCustomerTeamMemberMntc = (
    dto: AddCustomerMember_MntcDto,
    opts?: unknown
  ): Observable<AppUser_Customer_Dto> =>
    this._postAction<AppUser_Customer_Dto>(
      ServerRoutes.Account.action('addCustomerTeamMemberMntc'),
      dto,
      opts ?? {}
    );
    
  deleteCustomerByUserId = (
    userId: string,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._deleteAction<MessageResponseDto>(
      ServerRoutes.UserManagement.action('deleteCustomer'),
      [userId],
      opts ?? {}
    );

  getCustomers = (opts?: unknown): Observable<AppUser_Customer_Dto[]> =>
    this._getAction<AppUser_Customer_Dto[]>(
      ServerRoutes.UserManagement.action('getCustomers'),
      opts ?? {}
    );

  getCustomersPage = (
    dto: PagedRequest,
    opts?: unknown
  ): Observable<AppUser_Customer_DtoPagedResponse> =>
    this._postAction<AppUser_Customer_DtoPagedResponse>(
      ServerRoutes.UserManagement.action('getCustomersPage'),
      dto,
      opts ?? {}
    );

  getCustomerByTeamIdAndUserId = (
    teamId: string,
    userId: string,
    opts?: unknown
  ): Observable<AppUser_Customer_Dto> =>
    this._getActionById<AppUser_Customer_Dto>(
      ServerRoutes.UserManagement.action('getCustomer'),
      [teamId, userId],
      opts ?? {}
    );

  updatePosition = (
    dto: UpdatePositionDto,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._patchAction<AppUserDto>(
      ServerRoutes.UserManagement.action('updatePosition'),
      dto,
      opts ?? {}
    );

  updateMember = (dto: UpdateSelfDto, opts?: unknown): Observable<AppUserDto> =>
    this._patchAction<AppUserDto>(
      ServerRoutes.UserManagement.action('updateMember'),
      dto,
      opts ?? {}
    );

  updateLeader = (
    dto: UpdateTeamLeaderDto,
    opts?: unknown
  ): Observable<TeamDto> =>
    this._patchAction<TeamDto>(
      ServerRoutes.UserManagement.action('updateLeader'),
      dto,
      opts ?? {}
    );

  updateTwoFactorProvider = (
    dto: UpdateTwoFactorProviderDto,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._patchAction<AppUserDto>(
      ServerRoutes.UserManagement.action('updateTwoFactorProvider'),
      dto,
      opts ?? {}
    );

  updateAddress = (
    dto: IdentityAddressDto,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._patchAction<AppUserDto>(
      ServerRoutes.UserManagement.action('updateAddress'),
      dto,
      opts ?? {}
    );

  deleteMntcMemberByUserId = (
    userId: string,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._deleteAction<MessageResponseDto>(
      ServerRoutes.UserManagement.action('deleteMntcMember'),
      [userId],
      opts ?? {}
    );

  deleteSuperMemberByUserId = (
    userId: string,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._deleteAction<MessageResponseDto>(
      ServerRoutes.UserManagement.action('deleteSuperMember'),
      [userId],
      opts ?? {}
    );

  deleteTeamMemberByUserId = (
    userId: string,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._deleteAction<MessageResponseDto>(
      ServerRoutes.UserManagement.action('deleteTeamMember'),
      [userId],
      opts ?? {}
    );

  getTeamMembers = (opts?: unknown): Observable<AppUserDto[]> =>
    this._getAction<AppUserDto[]>(
      ServerRoutes.UserManagement.action('getTeamMembers'),
      opts ?? {}
    );

  getMntcTeamMembers = (opts?: unknown): Observable<AppUserDto[]> =>
    this._getAction<AppUserDto[]>(
      ServerRoutes.UserManagement.action('getMntcTeamMembers'),
      opts ?? {}
    );

  getSuperTeamMembers = (opts?: unknown): Observable<AppUserDto[]> =>
    this._getAction<AppUserDto[]>(
      ServerRoutes.UserManagement.action('getSuperTeamMembers'),
      opts ?? {}
    );

  getMntcTeamMembersPage = (
    dto: PagedRequest,
    opts?: unknown
  ): Observable<AppUserDtoPagedResponse> =>
    this._postAction<AppUserDtoPagedResponse>(
      ServerRoutes.UserManagement.action('getMntcTeamMembersPage'),
      dto,
      opts ?? {}
    );

  getSuperTeamMembersPage = (
    dto: PagedRequest,
    opts?: unknown
  ): Observable<AppUserDtoPagedResponse> =>
    this._postAction<AppUserDtoPagedResponse>(
      ServerRoutes.UserManagement.action('getSuperTeamMembersPage'),
      dto,
      opts ?? {}
    );

  getMyTeamMemberByUserId = (
    userId: string,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._getActionById<AppUserDto>(
      ServerRoutes.UserManagement.action('getMyTeamMember'),
      [userId],
      opts ?? {}
    );

  getTeamMemberByTeamIdAndUserId = (
    teamId: string,
    userId: string,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._getActionById<AppUserDto>(
      ServerRoutes.UserManagement.action('getTeamMember'),
      [teamId, userId],
      opts ?? {}
    );

  getSuperTeamMemberByUserId = (
    userId: string,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._getActionById<AppUserDto>(
      ServerRoutes.UserManagement.action('getSuperTeamMember'),
      [userId],
      opts ?? {}
    );

  getMntcTeamMemberByUserId = (
    userId: string,
    opts?: unknown
  ): Observable<AppUserDto> =>
    this._getActionById<AppUserDto>(
      ServerRoutes.UserManagement.action('getMntcTeamMember'),
      [userId],
      opts ?? {}
    );
}
