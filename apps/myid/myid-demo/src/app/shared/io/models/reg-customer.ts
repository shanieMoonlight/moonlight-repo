import { Identifier } from "./identifier"


export class RegCustomer {

  firstName?: string
  lastName?: string
  username?: string
  email: string = ''
  phone?: string
  password: string = ''
  confirmPassword: string = ''
  subscriptionDefinitionId?: Identifier


} //Cls