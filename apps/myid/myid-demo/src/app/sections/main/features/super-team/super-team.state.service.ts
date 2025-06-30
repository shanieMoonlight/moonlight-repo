import { computed, inject, Injectable } from '@angular/core';
import { MiniCrudState, MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, UserManagementIoService } from '@spider-baby/myid-io';
import { AddSuperMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { superTeam } from './fake-super-data';

@Injectable({
  providedIn: 'root'
})
export class SuperTeamStateService {


  private _ioAccService = inject(AccountIoService)
  private _ioService = inject(UserManagementIoService)

  //- - - - - - - - - - - - - //

  private _superTeamState = MiniStateBuilder
    .Create(() => this._ioService.getSuperTeamMembers())
    .trigger()


    

  private _crudState = MiniCrudState
    .Create<void, AppUserDto>(() => this._ioService.getSuperTeamMembers())
    .setAddState(
      (dto: AddSuperMemberDto) => this._ioAccService.addSuperTeamMember(dto),
      (dto) => `Member  ${dto.email} added!`)
    .setUpdateState(
      (dto: UpdatePositionDto) => this._ioService.updatePosition(dto),
      (dto) => `Member ${dto.email} updated successfully!`)
    .setDeleteState(
      (dto: AppUserDto) => this._ioService.deleteSuperMemberByUserId(dto.id),
      (dto) => `Member ${dto.e} deleted successfully 🗑️`)
    .trigger(undefined)//Trigger immediately with no filter

  private _addState = MiniStateBuilder
    .CreateWithInput((dto: AddSuperMemberDto) => this._ioAccService.addSuperTeamMember(dto))
    
  private _updatePositionState = MiniStateBuilder
    .CreateWithInput((dto: UpdatePositionDto) => this._ioService.updatePosition(dto))

  private _deleteMemberState = MiniStateBuilder
    .CreateWithInput((dto: AppUserDto) => this._ioService.deleteSuperMemberByUserId(dto.id))


  private _states = MiniStateCombined.Combine(
    this._addState,
    this._deleteMemberState,
    this._updatePositionState,
    this._superTeamState)

    
  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading
  data = this._superTeamState.data
  // successMsg = computed(() => '')
  // errorMsg =   computed(() => '')
  // loading =    computed(() => false)
  // data = computed(() => superTeam)

  //- - - - - - - - - - - - - //

  updatePostion(dto: UpdatePositionDto) {
    console.log('updatePostion:', dto);
    this._updatePositionState.trigger(dto);
  }

  addMember(dto: AddSuperMemberDto) {
    console.log('addMember');
    this._addState.trigger(dto);
  }

  deleteMember(dto: AppUserDto) {
    console.log('deleteMember');
    this._deleteMemberState.trigger(dto);
  }



}//Cls
