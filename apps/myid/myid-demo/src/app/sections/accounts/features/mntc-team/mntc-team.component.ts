import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AddMntcMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { SbUpdateTeamPositionFormComponent } from '@spider-baby/myid-ui-forms/update-team-position';
import { SbAddMntcMemberFormComponent } from '@spider-baby/myid-ui-forms/add-mntc-member';
import { CrudTableComponent } from '../../ui/crud-table/crud-table.component';
import { MntcTeamTableColumnsService } from './data-table-columns';
import { MntcTeamStateService } from './mntc-team.state.service';
import { MyIdTeamPositionOptionsProvider } from '../../../../shared/id/utils/options/team-position/team-position-options-provider';

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
  private _columnService = inject(MntcTeamTableColumnsService)
  private _teamPositionProvider = inject(MyIdTeamPositionOptionsProvider)

  //- - - - - - - - - - - -//

  protected _successMsg = this._state.successMsg
  protected _errorMsg = this._state.errorMsg
  protected _loading = this._state.loading
  protected _data = this._state.data
  protected _tableColumns = this._columnService.tableColumns

  protected _showAddForm = signal(false)

  protected _teamPositionOptions = this._teamPositionProvider.getOptions()
  protected _deleteMessageFn = (member: AppUserDto) =>
    `Are you sure you want to delete ${member.userName || member.email}? \nThis action cannot be undone.`

  protected _canUpdateMember = this._state.canUpdateMember



  addMntcMember = (dto: AddMntcMemberDto) =>
    this._state.addMember(dto);


  updatePosition = (dto: UpdatePositionDto) =>
    this._state.updatePosition(dto);

  deleteMember = (dto: AppUserDto) =>
    this._state.deleteMember(dto);

}
