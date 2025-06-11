
import { Identifier } from "./identifier";


export class LoginDto {

  userId?: Identifier
  username?: string
  email?: string
  password: string = ''
  deviceId?: Identifier


} //Cls
