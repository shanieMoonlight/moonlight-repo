import { effect, inject, Injectable } from '@angular/core';
import { MiniCrudState } from '@spider-baby/mini-state';
import { AccountIoService, UserManagementIoService } from '@spider-baby/myid-io';
import { AddSuperMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';

@Injectable({
  providedIn: 'root'
})
export class SuperTeamStateService0 {


  private _ioAccService = inject(AccountIoService)
  private _ioService = inject(UserManagementIoService)

  //- - - - - - - - - - - - - //

  private _crudState = MiniCrudState
    .Create<void, AppUserDto>(() => this._ioService.getSuperTeamMembers())
    .setAddState(
      (dto: AddSuperMemberDto) => this._ioAccService.addSuperTeamMember(dto),
      (dto) => `Member, ${dto.email} added!`)
    .setUpdateState(
      (dto: any) => this._ioService.updatePosition(dto),
      (dto, response) => `Member, ${response?.email} updated successfully!`)
    .setDeleteState(
      (dto: AppUserDto) => this._ioService.deleteSuperMemberByUserId(dto.id),
      (dto) => `Member, ${dto.email} deleted successfully 🗑️`)
    .trigger()//Trigger immediately with no filter

  successMsg = this._crudState.successMsg
  errorMsg = this._crudState.errorMsg
  loading = this._crudState.loading
  data = this._crudState.data


  //- - - - - - - - - - - - - //

  updatePostion(dto: UpdatePositionDto) {
    console.log('updatePostion:', dto);
    this._crudState.triggerUpdate(dto as any);
  }

  addMember(dto: AddSuperMemberDto) {
    console.log('addMember');
    this._crudState.triggerAdd(dto as any);
  }

  deleteMember(dto: AppUserDto) {
    console.log('deleteMember');
    this._crudState.triggerDelete(dto);
  }

  /**
   *
   */
  constructor() {
    effect(() => {
      const loading = this._crudState.loading
      console.log(`SuperTeamStateService loading: ${loading()}`);
    })

  }


}//Cls
