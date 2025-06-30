import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { AddSuperMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { SbUpdateTeamPositionFormComponent } from '@spider-baby/myid-ui-forms/update-team-position';
import { ActionEvent, SbDataTableComponent, SbDataTableRowData } from '@spider-baby/ui-kit/table';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { SbAddSuperMemberFormComponent } from '../../../../shared/id/ui/forms/add-super-member/add-super-member-form.component';
import { teamPositionOptions } from '../../../../shared/id/utils/team-position-options';
import { SbModalComponent } from '../../../../shared/ui/modal/modal.component';
import { SuperTeamTableActions, tableColumns } from './data-table-columns';
import { SuperTeamStateService } from './super-team.state.service';

@Component({
  selector: 'sb-super-team',
  standalone: true,
  imports: [
    SbDataTableComponent,
    SbAddSuperMemberFormComponent,
    SbModalComponent,
    SbMatNotificationsModalComponent,
    SbUpdateTeamPositionFormComponent,
    CommonModule
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
  protected _addSuccess = this._state.addSuccess
  protected _updateSuccess = this._state.updateSuccess

  protected _showAddForm = signal(false)

  protected _updateUser = signal<AppUserDto | undefined>(undefined)
  protected _showUpdateForm = signal(false)

  protected _teamPositionOptions = teamPositionOptions

  //- - - - - - - - - - - -//

  constructor() {
    effect(() => {
      if (this._addSuccess())
        this._showAddForm.set(false)
    });

    effect(() => {
      if (this._updateSuccess())
        this._showUpdateForm.set(false)
    });

  }

  //- - - - - - - - - - - -//

  onAction(actionEvent: ActionEvent<AppUserDto>) {

    if (actionEvent.action !== SuperTeamTableActions.delete)
      return

    this._state.deleteMember(actionEvent.item)
  }


  onAddItem = () =>
    this._showAddForm.set(true);

  addMember = (dto: AddSuperMemberDto) =>
    this._state.addMember(dto);


  onRowClick(rowData: SbDataTableRowData<AppUserDto>) {
    this._updateUser.set(rowData.element);
    this._showUpdateForm.set(true);
  }

  updatePosition = (dto: UpdatePositionDto) =>
    this._state.updatePosition(dto);

}
