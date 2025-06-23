export class Claim {

  /** Claim Creator */
  issuer: string = 'shanie.moonlight.myid'
  originalIssuer?: string

  /** User of the claim */
  subject?: string;
  /** Claim Identifier */
  type: string;
  /** Claim data */
  value: any;
  /** type of claim data */
  valueType?: string

  //- - - - - - - - - //

  private constructor(type: string, value: any, issuer?: string, subject?: string) {
    this.type = type
    this.value = value
    if (issuer)
      this.issuer = issuer
    if (subject)
      this.subject = subject
  }

  //------------------//

  /**
   * @param issuer Claim Creator
   * @param subject User of the claim
   * @param type Claim Identifier
   * @param value Claim data
   */
  static CreateWithIssuer = (issuer: string, subject: string, type: string, value: any) =>
    new Claim(type, value, issuer, subject)

  //------------------//

  /**
   * @param type Claim Identifier
   * @param value Claim data
   */
  static Create = (type: string, value: any) =>
    new Claim(type, value)

  //------------------//

} //Cls
