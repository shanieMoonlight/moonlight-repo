import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AppUserCustomerDto } from '@spider-baby/myid-io/models';
import { teamPositionOptions } from '../../../../shared/id/utils/team-position-options';
import { CrudTableComponent } from '../../ui/crud-table/crud-table.component';
import { CustomersStateService } from './customers.state.service';
import { CustomersTableColumnsService } from './data-table-columns';

@Component({
  selector: 'sb-customers',
  standalone: true,
  imports: [
    CrudTableComponent
  ],
  providers: [CustomersStateService],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersComponent {


  private _state = inject(CustomersStateService)
  private _columnService = inject(CustomersTableColumnsService)

  //- - - - - - - - - - - -//

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _data = this._state.data
  protected _tableColumns = this._columnService.tableColumns


  protected _deleteMessageFn = (member: AppUserCustomerDto) =>
    `Are you sure you want to delete ${member.userName || member.email}? \nThis action cannot be undone.`

  //- - - - - - - - - - - -//


  deleteCustomer = (dto: AppUserCustomerDto) =>
    this._state.deleteCustomer(dto);

}
