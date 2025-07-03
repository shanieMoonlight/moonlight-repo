import { inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { UserManagementIoService } from '@spider-baby/myid-io';
import { AddSuperMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { MyIdTeamPositionOptionsProvider } from '../../../../shared/id/utils/options/team-position/team-position-options-provider';
import { CrudArraySignalOps } from '../../../../shared/utils/crud-array-ops/crud-array-ops.signal';

@Injectable({
  providedIn: 'root'
})
export class SuperTeamStateService {

  private _ioService = inject(UserManagementIoService)
  private _teamPositionProvider = inject(MyIdTeamPositionOptionsProvider)


  private _crudSignalOps = new CrudArraySignalOps<AppUserDto>();

  //- - - - - - - - - - - - - //

  private _superTeamState = MiniStateBuilder
    .Create(() => this._ioService.getSuperTeamMembers())
    .setOnSuccessFn((dto, response) => this._crudSignalOps.refresh(response))
    .trigger()

  private _addState = MiniStateBuilder
    .CreateWithInput((dto: AddSuperMemberDto) => this._ioService.addSuperTeamMember(dto))
    .setSuccessMsgFn((dto) => `Member, ${dto.email} added!`)
    .setOnSuccessFn((dto, response) => this._crudSignalOps.append(response))

  private _updatePositionState = MiniStateBuilder
    .CreateWithInput((dto: UpdatePositionDto) => this._ioService.updatePosition(dto))
    .setSuccessMsgFn((dto, response) => `Member, ${response?.email} updated successfully!`)
    .setOnSuccessFn((dto, response) => this._crudSignalOps.insert(response))

  private _deleteMemberState = MiniStateBuilder
    .CreateWithInput((dto: AppUserDto) => this._ioService.deleteSuperMemberByUserId(dto.id))
    .setSuccessMsgFn((dto) => `Member, ${dto.email} deleted successfully 🗑️`)
    .setOnSuccessFn((dto) => this._crudSignalOps.delete(dto))


  private _states = MiniStateCombined.Combine(
    this._addState,
    this._deleteMemberState,
    this._updatePositionState,
    this._superTeamState)


  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading
  data = this._crudSignalOps.data
  // data = signal(fakeSuperTeam)

  //- - - - - - - - - - - - - //

  updatePosition = (dto: UpdatePositionDto) => 
    this._updatePositionState.trigger(dto);

  addMember=(dto: AddSuperMemberDto)=>  
    this._addState.trigger(dto);

  deleteMember=(dto: AppUserDto) => 
    this._deleteMemberState.trigger(dto)



}//Cls
