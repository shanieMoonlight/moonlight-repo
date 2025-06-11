import { TeamPosition } from "./team-position";

export class AddMntcMember {

  firstName?: string
  lastName?: string
  username?: string
  email: string = ''
  phone?: string
  teamPosition: TeamPosition = TeamPosition.guest


} //Cls
