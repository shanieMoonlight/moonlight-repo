import { Identifier } from "./identifier";


export class ConfirmPhone {

  constructor(
    public userId?: Identifier,
    public confirmationToken?: string
  ) {  }


} //Cls