import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, TemplateRef } from '@angular/core';
import { ActionEvent, BaseDataTableRowData, ColumnData, SbDataTableComponent, SbDataTableRowData } from '@spider-baby/ui-kit/table';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { teamPositionOptions } from '../../../../shared/id/utils/team-position-options';
import { SbModalComponent } from '../../../../shared/ui/modal/modal.component';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';

//##############################//

export class CrudTableableActions {
  static delete = 'delete';
}


const DefaultDeleteMessage = 'Are you sure you want to delete this item?';

//##############################//

@Component({
  selector: 'sb-crud-table',
  standalone: true,
  imports: [
    SbDataTableComponent,
    SbModalComponent,
    SbMatNotificationsModalComponent
  ],
  templateUrl: './crud-table.component.html',
  styleUrl: './crud-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudTableComponent<T extends BaseDataTableRowData> {


  private _confirmService = inject(ConfirmModalService)



  successMsg = input<string | undefined>(undefined)
  errorMsg = input<string | undefined>(undefined)
  loading = input<boolean>(false)
  
  tableColumns = input<ColumnData<T>[]>([])
  data = input<T[]>([])
  
  deleteModalTitle = input<string>('Delete?')
  deleteModalMessageFn = input<(t: T) => string>(() => DefaultDeleteMessage)
  
  updateFormTemplate = input<TemplateRef<unknown> | undefined>()
  addFormTemplate = input<TemplateRef<unknown> | undefined>()
  rowClickable = input<boolean>(true)

  addItemTooltip = input('Add Item');

  deleteItem = output<T>()

  protected _showAddForm = signal(false)

  protected _updateItem = signal<T | undefined>(undefined)
  protected _showUpdateForm = signal(false)

  protected _teamPositionOptions = teamPositionOptions

  protected _deleteModalMessage = signal<string>(DefaultDeleteMessage)

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

  async onAction(actionEvent: ActionEvent<T>) {

    if (actionEvent.action !== CrudTableableActions.delete)
      return

    const description = this.deleteModalMessageFn()?.(actionEvent.item) || DefaultDeleteMessage;
    this._deleteModalMessage.set(description);

    const result = await this._confirmService.open(this.deleteModalTitle(), description)
    if (result)
      this.deleteItem.emit(actionEvent.item);

  }

  protected onAddItem = () =>
    this._showAddForm.set(true);


  protected onRowClick(rowData: SbDataTableRowData<T>) {
    this._updateItem.set(rowData.element);
    this._showUpdateForm.set(true);
  }


}
