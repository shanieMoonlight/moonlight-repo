import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output, signal, TemplateRef } from '@angular/core';
import { SbUpdateTeamPositionFormComponent } from '@spider-baby/myid-ui-forms/update-team-position';
import { ActionEvent, BaseDataTableRowData, ColumnData, SbDataTableComponent, SbDataTableRowData } from '@spider-baby/ui-kit/table';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbAddSuperMemberFormComponent } from '../../../../shared/id/ui/forms/add-super-member/add-super-member-form.component';
import { teamPositionOptions } from '../../../../shared/id/utils/team-position-options';
import { SbModalComponent } from '../../../../shared/ui/modal/modal.component';

//##############################//

export class CrudTableableActions {
  static delete = 'delete';
}

//##############################//

@Component({
  selector: 'sb-crud-table',
  standalone: true,
  imports: [
    SbDataTableComponent,
    SbModalComponent,
    SbMatNotificationsModalComponent,
    CommonModule
  ],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudTableComponent<T extends BaseDataTableRowData, AddItem, UpdateItem> {


  successMsg = input<string | undefined>(undefined)
  errorMsg = input<string | undefined>(undefined)
  loading = input<boolean>(false)

  // addSuccess = input<boolean>(false)
  // updateSuccess = input<boolean>(false)

  tableColumns = input<ColumnData<T>[]>([])
  data = input<T[]>([])

  updateFormTemplate = input.required<TemplateRef<undefined>>()
  addFormTemplate = input.required<TemplateRef<undefined>>()


  addItem = output<AddItem>()
  updateItem = output<UpdateItem>()
  deleteItem = output<T>()



  protected _showAddForm = signal(false)

  protected _updateUser = signal<T | undefined>(undefined)
  protected _showUpdateForm = signal(false)

  protected _teamPositionOptions = teamPositionOptions

  //- - - - - - - - - - - -//

  constructor() {
    effect(() => {
      if (this.successMsg()) {
        this._showAddForm.set(false)
        this._showUpdateForm.set(false)
      }
    });
  }

  //- - - - - - - - - - - -//

  onAction(actionEvent: ActionEvent<T>) {

    if (actionEvent.action !== CrudTableableActions.delete)
      return

    this.deleteItem.emit(actionEvent.item)
  }


  protected onAddItem = () =>
    this._showAddForm.set(true);

  protected addMember = (dto: AddItem) =>
    this.addItem.emit(dto);


  onRowClick(rowData: SbDataTableRowData<T>) {
    this._updateUser.set(rowData.element);
    this._showUpdateForm.set(true);
  }

  updatePosition = (dto: UpdateItem) =>
    this.updateItem.emit(dto);

}
