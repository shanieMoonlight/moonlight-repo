
import { TeamPositionOption, MyIdTeamPositionOptionsProvider } from "@spider-baby/myid-auth/config";
import { TeamPositions } from "./team-position-info";

//############################//

export const userMgrAdminTeamPositionOptions: TeamPositionOption[] = [
  { value: TeamPositions.USER.value, label: TeamPositions.USER.label },
  { value: TeamPositions.MGR.value, label: TeamPositions.MGR.label },
  { value: TeamPositions.ADMIN.value, label: TeamPositions.ADMIN.label }
]

//############################//

export class UserMgrAdminTeamPositionOptionsProvider extends MyIdTeamPositionOptionsProvider {

  override getOptions(): TeamPositionOption[] {
    return userMgrAdminTeamPositionOptions
  }

}

//############################//