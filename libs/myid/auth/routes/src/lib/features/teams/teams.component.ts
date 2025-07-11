import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TeamDto } from '@spider-baby/myid-io/models';
import { AddTeamFormDto, SbAddTeamFormComponent, SbUpdateTeamFormComponent, UpdateTeamFormDto } from "@spider-baby/myid-ui/team";
import { CrudTableComponent } from '../../ui/crud-table/crud-table.component';
import { TeamsTableColumnsService } from './data-table-columns';
import { TeamsTableStateService } from './teams.state.service';

@Component({
    selector: 'sb-teams-table',
    standalone: true,
    imports: [
        SbUpdateTeamFormComponent,
        SbAddTeamFormComponent,
        CrudTableComponent
    ],
    providers: [TeamsTableStateService],
    templateUrl: './teams.component.html',
    styleUrl: './teams.component.scss',
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
    protected _canUpdateTeamPositionRangefn = this._state.canUpdateTeamPositionRangeFn;
    protected _canUpdateTeamLeaderfn = this._state.canUpdateTeamLeaderFn;

    protected _showAddForm = signal(false);
    protected _selectedTeam = signal(null);


    protected _tableColumns = this._columnService.tableColumns


    protected _deleteMessageFn = (member: TeamDto) =>
        `Are you sure you want to delete team, ${member.name}? \nThis action cannot be undone.`

    addTeam = (dto: AddTeamFormDto) => this._state.addTeam(dto);
    updateTeam = (dto: UpdateTeamFormDto) => this._state.updateTeam(dto);
    deleteTeam = (dto: UpdateTeamFormDto) => this._state.deleteTeam(dto);

}
