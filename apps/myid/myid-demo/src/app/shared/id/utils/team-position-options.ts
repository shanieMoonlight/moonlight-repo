import { SelectOption } from "../../ui/select/select.component";
import { TeamPositions } from "./team-position-info";

export const teamPositionOptions: SelectOption[] = [
    { value: TeamPositions.USER, label: TeamPositions.USER.name },
    { value: TeamPositions.MGR, label: TeamPositions.MGR.name },
    { value: TeamPositions.ADMIN, label: TeamPositions.ADMIN.name }
  ]