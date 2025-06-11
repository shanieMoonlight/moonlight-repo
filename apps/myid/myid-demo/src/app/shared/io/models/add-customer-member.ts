import { Identifier } from "./identifier";
import { TeamPosition } from "./team-position";


export class AddCustomerMember {

  firstName?: string
  lastName?: string
  username?: string
  email: string = ''
  phone?: string
  position: TeamPosition = TeamPosition.guest


} //Cls
