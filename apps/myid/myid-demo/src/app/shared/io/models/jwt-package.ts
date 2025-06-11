import { TwoFactorProvider } from "./two-factor-provider"


export class JwtPackage {

  accessToken?: string
  expiration: number = 0
  twoStepVerificationRequired: boolean = false
  twoFactorProvider?: TwoFactorProvider
  extraInfo?: string
  expirationDate: string = ''


} //Cls