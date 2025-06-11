import { Identifier } from './identifier';


export class ResetPwd {

  userId?: Identifier
  username?: string
  email?: string
  newPassword: string = ''
  confirmPassword: string = ''
  resetToken: string = ''

} //Cls
