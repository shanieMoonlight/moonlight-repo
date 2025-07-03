import { inject, Injectable } from '@angular/core';
import { MiniStateBuilder } from '@spider-baby/mini-state';
import { MiniStateCombined } from '@spider-baby/mini-state/utils';
import { AccountIoService, UserManagementIoService } from '@spider-baby/myid-io';
import { AppUserCustomerDto } from '@spider-baby/myid-io/models';
import { CrudArraySignalOps } from '../../../../shared/utils/crud-array-ops/crud-array-ops.signal';

@Injectable({
  providedIn: 'root'
})
export class CustomersStateService {

  private _userMgmtIoService = inject(UserManagementIoService)
  private _accountIoService = inject(AccountIoService)


  private _crudSignalOps = new CrudArraySignalOps<AppUserCustomerDto>();

  //- - - - - - - - - - - - - //

  private _customersState = MiniStateBuilder
    .Create(() => this._userMgmtIoService.getCustomers())
    .setOnSuccessFn((dto, response) => this._crudSignalOps.refresh(response))
    .trigger()


  private _deleteCustomerState = MiniStateBuilder
    .CreateWithInput((dto: AppUserCustomerDto) => this._accountIoService.closeAccountByTeamId(dto.teamId))
    .setSuccessMsgFn((dto) => `Member, ${dto.email} deleted successfully 🗑️`)
    .setOnSuccessFn((dto) => this._crudSignalOps.delete(dto))


  private _states = MiniStateCombined.Combine(
    this._deleteCustomerState,
    this._customersState)


  successMsg = this._states.successMsg
  errorMsg = this._states.errorMsg
  loading = this._states.loading
  data = this._crudSignalOps.data

  //- - - - - - - - - - - - - //


  deleteCustomer=(dto: AppUserCustomerDto) => 
    this._deleteCustomerState.trigger(dto)



}//Cls
