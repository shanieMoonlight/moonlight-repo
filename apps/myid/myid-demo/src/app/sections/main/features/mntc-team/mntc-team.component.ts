import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AddMntcMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { SbUpdateTeamPositionFormComponent } from '@spider-baby/myid-ui-forms/update-team-position';
import { SbAddMntcMemberFormComponent } from '../../../../shared/id/ui/forms/add-mntc-member/add-mntc-member-form.component';
import { teamPositionOptions } from '../../../../shared/id/utils/team-position-options';
import { CrudTableComponent } from '../../ui/crud-table/crud-table.component';
import { tableColumns } from './data-table-columns';
import { MntcTeamStateService } from './mntc-team.state.service';

@Component({
  selector: 'sb-mntc-team',
  standalone: true,
  imports: [
    SbAddMntcMemberFormComponent,
    SbUpdateTeamPositionFormComponent,
    CrudTableComponent
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

  protected _teamPositionOptions = teamPositionOptions



  addMntcMember = (dto: AddMntcMemberDto) => 
    this._state.addMember(dto);


  updatePosition = (dto: UpdatePositionDto) =>
    this._state.updatePosition(dto);

  deleteMember = (dto: AppUserDto) =>
    this._state.deleteMember(dto);

}
