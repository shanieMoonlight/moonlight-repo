import { inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, UserManagementIoService } from '@spider-baby/myid-io';
import { AddMntcMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { CrudArraySignalOps } from '../../../../shared/utils/crud-array-ops/crud-array-ops.signal';
import { MyIdAuthService } from '../../../../shared/auth/services/auth/myid-auth.browser.service';

@Injectable()
export class MntcTeamStateService {

  private _ioAccService = inject(AccountIoService)
  private _ioService = inject(UserManagementIoService)
  private _auth = inject(MyIdAuthService)


  private _crudSignalOps = new CrudArraySignalOps<AppUserDto>();

  //- - - - - - - - - - - - - //

  private _mntcTeamState = MiniStateBuilder
    .Create(() => this._ioService.getMntcTeamMembers())
    .setOnSuccessFn((dto, response) => this._crudSignalOps.refresh(response))
    .trigger()

  private _addState = MiniStateBuilder
    .CreateWithInput((dto: AddMntcMemberDto) => this._ioAccService.addMntcTeamMember(dto))
    .setSuccessMsgFn((dto) => `Member, ${dto.email} added!`)
    .setOnSuccessFn((dto, response) => this._crudSignalOps.append(response))

  private _updatePositionState = MiniStateBuilder
    .CreateWithInput((dto: UpdatePositionDto) => this._ioService.updatePosition(dto))
    .setSuccessMsgFn((dto, response) => `Member, ${response?.email} updated successfully!`)
    .setOnSuccessFn((dto, response) => this._crudSignalOps.insert(response))

  private _deleteMemberState = MiniStateBuilder
    .CreateWithInput((dto: AppUserDto) => this._ioService.deleteMntcMemberByUserId(dto.id))
    .setSuccessMsgFn((dto) => `Member, ${dto.email} deleted successfully 🗑️`)
    .setOnSuccessFn((dto) => this._crudSignalOps.delete(dto))


  private _states = MiniStateCombined.Combine(
    this._addState,
    this._deleteMemberState,
    this._updatePositionState,
    this._mntcTeamState)


  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading
  data = this._crudSignalOps.data
  canUpdateMember = this._auth.isMntc

  //- - - - - - - - - - - - - //

  updatePosition = (dto: UpdatePositionDto) => 
    this._updatePositionState.trigger(dto);

  addMember=(dto: AddMntcMemberDto)=>  
    this._addState.trigger(dto);

  deleteMember=(dto: AppUserDto) => 
    this._deleteMemberState.trigger(dto)

}//Cls
