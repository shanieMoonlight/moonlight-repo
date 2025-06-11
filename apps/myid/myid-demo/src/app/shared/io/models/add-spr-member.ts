import { TeamPosition } from "./team-position";
import { TwoFactorProvider } from "./two-factor-provider";


export class AddSprMember {

  firstName?: string
  lastName?: string
  username?: string
  email: string = ''
  phone?: string
  teamPosition: TeamPosition = TeamPosition.guest
  twoFactorProvider?: TwoFactorProvider = TwoFactorProvider.Sms
  twoFactorEnabled?: boolean = false
} //Cls
