import { Identifier } from "./identifier";



export class ConfirmEmail {

  constructor(
    public userId?: Identifier,
    public confirmationToken?: string
  ) {  }


} //Cls