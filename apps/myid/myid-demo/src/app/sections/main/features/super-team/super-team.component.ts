import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AddSuperMemberDto, AppUserDto, UpdatePositionDto } from '@spider-baby/myid-io/models';
import { SbUpdateTeamPositionFormComponent } from '@spider-baby/myid-ui-forms/update-team-position';
import { SbAddSuperMemberFormComponent } from '../../../../shared/id/ui/forms/add-super-member/add-super-member-form.component';
import { teamPositionOptions } from '../../../../shared/id/utils/team-position-options';
import { CrudTableComponent } from '../../ui/crud-table/crud-table.component';
import { tableColumns } from './data-table-columns';
import { SuperTeamStateService } from './super-team.state.service';

@Component({
  selector: 'sb-super-team',
  standalone: true,
  imports: [
    SbAddSuperMemberFormComponent,
    SbUpdateTeamPositionFormComponent,
    CommonModule,
    CrudTableComponent
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

  protected _updateUser = signal<AppUserDto | undefined>(undefined)
  protected _showUpdateForm = signal(false)

  protected _teamPositionOptions = teamPositionOptions

  //- - - - - - - - - - - -//

  addMember = (dto: AddSuperMemberDto) =>
    this._state.addMember(dto);


  updatePosition = (dto: UpdatePositionDto) =>
    this._state.updatePosition(dto);

  deleteMember = (dto: AppUserDto) =>
    this._state.deleteMember(dto);

}
