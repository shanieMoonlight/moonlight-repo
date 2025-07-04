import { Injectable, computed, inject } from "@angular/core";
import { MiniStateBuilder } from "@spider-baby/mini-state";
import { MiniStateCombined } from "@spider-baby/mini-state/utils";
import { TeamsIoService } from "@spider-baby/myid-io";
import { AddTeamDto, TeamDto } from "@spider-baby/myid-io/models";
import { MyIdAuthService } from "../../../../shared/id/auth/services/auth/myid-auth.browser.service";
import { CrudArraySignalOps } from "../../../../shared/utils/crud-array-ops/crud-array-ops.signal";

@Injectable()
export class TeamsTableStateService {
    
    private _ioService = inject(TeamsIoService);
    private _auth = inject(MyIdAuthService);

    //----------------------//

    private _crudSignalOps = new CrudArraySignalOps<TeamDto>();

    private _teamsState = MiniStateBuilder
        .Create(() => this._ioService.getAll())
        .setOnSuccessFn((dto, response) => this._crudSignalOps.refresh(response))
        .trigger();

    private _addState = MiniStateBuilder
        .CreateWithInput((dto: AddTeamDto) => this._ioService.add(dto))
        .setSuccessMsgFn((dto) => `Team, ${dto.name} added!`)
        .setOnSuccessFn((dto, response) => this._crudSignalOps.append(response));

    private _updateState = MiniStateBuilder
        .CreateWithInput((dto: TeamDto) => this._ioService.edit(dto))
        .setSuccessMsgFn((dto, response) => `Team, ${response?.name} updated successfully!`)
        .setOnSuccessFn((dto, response) => this._crudSignalOps.insert(response));

    private _deleteState = MiniStateBuilder
        .CreateWithInput((dto: TeamDto) => this._ioService.deleteById(dto.id))
        .setSuccessMsgFn((dto) => `Team, ${dto.name} deleted successfully 🗑️`)
        .setOnSuccessFn((dto) => this._crudSignalOps.delete(dto));

    private _states = MiniStateCombined.Combine(
        this._addState,
        this._deleteState,
        this._updateState,
        this._teamsState
    );

    successMsg = this._states.successMsg;
    errorMsg = this._states.errorMsg;
    loading = this._states.loading;
    data = this._crudSignalOps.data;
    canUpdateTeam = computed(() => this._auth.isMntcMinimum());

    //----------------------//

    canUpdateTeamFn = (team: TeamDto) => {
        switch (team.teamType) {
            case 'customer':
                return this._auth.isMntcPositionMinimum(2)();
            case 'maintenance':
                return this._auth.isSuperPositionMinimum(2)();
            default:
                return this._auth.isSuperLdr();
        }
    };

    
    canUpdateTeamPositionRangeFn = (team: TeamDto) => {
        switch (team.teamType) {
            case 'customer':
                return this._auth.isMntcPositionMinimum(2)();
            case 'maintenance':
                return this._auth.isMntcLdr();
            default:
                return this._auth.isSuperLdr();
        }
    }

    //Can only change the leader of your own team. If you are also the leader of the team.
    canUpdateTeamLeaderFn = (team: TeamDto) => 
       this._auth.teamType() === team.teamType && this._auth.isLdr();

    //----------------------//

    updateTeam = (dto: TeamDto) =>
        this._updateState.trigger(dto);

    addTeam = (dto: AddTeamDto) =>
        this._addState.trigger(dto);

    deleteTeam = (dto: TeamDto) =>
        this._deleteState.trigger(dto);
}
