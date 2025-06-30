import { computed, inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, UserManagementIoService } from '@spider-baby/myid-io';
import { AddMntcMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { superTeam } from './fake-super-data';

@Injectable({
  providedIn: 'root'
})
export class MntcTeamStateService {


  private _ioAccService = inject(AccountIoService)
  private _ioService = inject(UserManagementIoService)

  //- - - - - - - - - - - - - //

  private _mntcTeamState = MiniStateBuilder
    .Create(() => this._ioService.getMntcTeamMembers())
    .trigger()

  private _addState = MiniStateBuilder
    .CreateWithInput((dto: AddMntcMemberDto) => this._ioAccService.addMntcTeamMember(dto))
    
  private _updatePositionState = MiniStateBuilder
    .CreateWithInput((dto: UpdatePositionDto) => this._ioService.updatePosition(dto))

      private _deleteMemberState = MiniStateBuilder
    .CreateWithInput((dto: AppUserDto) => this._ioService.deleteMntcMemberByUserId(dto.id))


  private _states = MiniStateCombined.Combine(
    this._addState,
    this._deleteMemberState,
    this._updatePositionState,
    this._mntcTeamState)

    
  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading
  data = this._mntcTeamState.data
  // successMsg = computed(() => '')
  // errorMsg =   computed(() => '')
  // loading =    computed(() => false)
  // data = computed(() => superTeam)

  //- - - - - - - - - - - - - //

  updatePostion(dto: UpdatePositionDto) {
    console.log('updatePostion:', dto);
    this._updatePositionState.trigger(dto);
  }

  addMember(dto: AddMntcMemberDto) {
    console.log('addMember');
    this._addState.trigger(dto);
  }

  deleteMember(dto: AppUserDto) {
    console.log('deleteMember');
    this._deleteMemberState.trigger(dto);
  }



}//Cls
