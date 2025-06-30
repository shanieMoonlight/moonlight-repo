import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActionEvent, SbDataTableComponent, SbDataTableRowData } from '@spider-baby/ui-kit/table';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbAddMntcMemberFormComponent } from '../../../../shared/id/ui/forms/add-mntc-member/add-mntc-member-form.component';
import { SbModalComponent } from '../../../../shared/ui/modal/modal.component';
import { MntcTeamStateService } from './mntc-team.state.service';
import { MntcTeamTableActions, tableColumns } from './data-table-columns';
import { AddMntcMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';

@Component({
  selector: 'sb-mntc-team',
  standalone: true,
  imports: [
    SbDataTableComponent,
    SbAddMntcMemberFormComponent,
    SbModalComponent,
    SbMatNotificationsModalComponent,
  ],
  providers: [MntcTeamStateService],
  templateUrl: './mntc-team.component.html',
  styleUrl: './mntc-team.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MntcTeamComponent {


  private _state = inject(MntcTeamStateService)

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

    if (actionEvent.action !== MntcTeamTableActions.delete)
      return

    console.log('Action event:', actionEvent);
    this._state.deleteMember(actionEvent.item);

  }

  onAddItem() {
    console.log('handleAddItem');
    this._showAddForm.set(true);
  }

  addMntcMember(dto: AddMntcMemberDto) {
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
