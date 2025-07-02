import { SelectOption } from "@spider-baby/ui-kit/select";
import { TeamPositions } from "./team-position-info";

export const teamPositionOptions: SelectOption[] = [
    { value: TeamPositions.USER.value, label: TeamPositions.USER.name },
    { value: TeamPositions.MGR.value, label: TeamPositions.MGR.name },
    { value: TeamPositions.ADMIN.value, label: TeamPositions.ADMIN.name }
  ]