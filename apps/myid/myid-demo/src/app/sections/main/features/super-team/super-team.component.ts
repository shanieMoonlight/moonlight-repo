import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActionEvent, SbDataTableComponent, SbDataTableRowData } from '@spider-baby/ui-kit/table';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbAddSuperMemberFormComponent } from '../../../../shared/id/ui/forms/add-super-member/add-super-member-form.component';
import { SbModalComponent } from '../../../../shared/ui/modal/modal.component';
import { SuperTeamStateService } from './super-team.state.service';
import { SuperTeamTableActions, tableColumns } from './data-table-columns';
import { AddSuperMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';

@Component({
  selector: 'sb-super-team',
  standalone: true,
  imports: [
    SbDataTableComponent,
    SbAddSuperMemberFormComponent,
    SbModalComponent,
    SbMatNotificationsModalComponent,
  ],
  providers: [SuperTeamStateService],
  templateUrl: './super-team.component.html',
  styleUrl: './super-team.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperTeamComponent {


  private _state = inject(SuperTeamStateService)

  //- - - - - - - - - - - -//

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _data = this._state.data
  protected _tableColumns = tableColumns

  protected _showAddForm = signal(false)

  onRowClick(rowData: SbDataTableRowData<AppUserDto>) {
    console.log('Row clicked:', rowData);

  }


  onAction(actionEvent: ActionEvent<AppUserDto>) {

    if (actionEvent.action !== SuperTeamTableActions.delete)
      return

    console.log('Action event:', actionEvent);
    this._state.deleteMember(actionEvent.item);

  }

  onAddItem() {
    console.log('handleAddItem');
    this._showAddForm.set(true);
  }

  addSuperMember(dto: AddSuperMemberDto) {
    console.log('addMember');
    this._state.addMember(dto);
    this._showAddForm.set(false);
  }


  handleRowClick() {
    console.log('handleAddItem');
    this._showAddForm.set(true);
  }

  updatePostion(dto: UpdatePositionDto) {
    console.log('updatePostion:', dto);
    this._state.updatePostion(dto);
  }

}
