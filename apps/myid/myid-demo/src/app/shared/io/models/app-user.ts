
import { Identifier } from "./identifier";
import { TeamPosition } from "./team-position";
import { TwoFactorProvider } from "./two-factor-provider";


//=====================================//

export class AppUser {

  id?: Identifier
  firstName?: string
  lastName?: string
  phoneNumber?: string
  userName?: string
  email: string = ''
  teamId?: Identifier
  teamPosition: TeamPosition = TeamPosition.guest
  twoFactorProvider: TwoFactorProvider = TwoFactorProvider.Sms
  twoFactorEnabled: boolean = false
  emailConfirmed: boolean = false


} //Cls