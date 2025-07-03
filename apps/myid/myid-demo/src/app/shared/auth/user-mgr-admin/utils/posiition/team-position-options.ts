import { MyIdTeamPositionOptionsProvider, TeamPositionOption } from "../../../../id/utils/options/team-position/team-position-options-provider";
import { TeamPositions } from "./team-position-info";

//#######################################//

export const teamPositionOptions: TeamPositionOption[] = [
  { value: TeamPositions.USER.value, label: TeamPositions.USER.name },
  { value: TeamPositions.MGR.value, label: TeamPositions.MGR.name },
  { value: TeamPositions.ADMIN.value, label: TeamPositions.ADMIN.name }
]

//#######################################//

export class CustomTeamPositionOptionsProvider extends MyIdTeamPositionOptionsProvider {
  override getOptions(): TeamPositionOption[] {
    return [
      { value: 1, label: 'Test Position 1' },
      { value: 2, label: 'Test Position 2' },
      { value: 3, label: 'Test Position 3' }
    ];
  }
}

//#######################################//