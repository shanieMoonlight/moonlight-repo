import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TeamDto } from '@spider-baby/myid-io/models';
import { SbUpdateTeamFormComponent, UpdateTeamFormDto } from '../../../../shared/id/ui/forms/team/update/update-team.component';
import { CrudTableComponent } from '../../../main/ui/crud-table/crud-table.component';
import { TeamsTableColumnsService } from './data-table-columns';
import { TeamsTableStateService } from './teams-table.state.service';
import { AddTeamFormDto, SbAddTeamFormComponent } from '../../../../shared/id/ui/forms/team/add/add-team.component';

@Component({
    selector: 'sb-teams-table',
    standalone: true,
    imports: [
        SbUpdateTeamFormComponent,
        SbAddTeamFormComponent,
        CrudTableComponent
    ],
    providers: [TeamsTableStateService],
    templateUrl: './teams-table.component.html',
    styleUrl: './teams-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsTableComponent {
    private _state = inject(TeamsTableStateService);
    private _columnService = inject(TeamsTableColumnsService);

    protected _successMsg = this._state.successMsg;
    protected _errorMsg = this._state.errorMsg;
    protected _loading = this._state.loading;
    protected _data = this._state.data;
    protected _canUpdateTeam = this._state.canUpdateTeam;
    protected _canUpdateTeamFn = this._state.canUpdateTeamFn;
    protected _canUpdateTeamPositionRangefn = this._state.canUpdateTeamPositionRangefn;
    protected _canUpdateTeamLeaderfn = this._state.canUpdateTeamLeaderfn;

    protected _showAddForm = signal(false);
    protected _selectedTeam = signal(null);


    protected _tableColumns = this._columnService.tableColumns


    protected _deleteMessageFn = (member: TeamDto) =>
        `Are you sure you want to delete team, ${member.name}? \nThis action cannot be undone.`

    addTeam = (dto: AddTeamFormDto) => this._state.addTeam(dto);
    updateTeam = (dto: UpdateTeamFormDto) => this._state.updateTeam(dto);
    deleteTeam = (dto: UpdateTeamFormDto) => this._state.deleteTeam(dto);

}
