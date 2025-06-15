import { Identifier } from "./identifier"


export interface GoogleSignUp {
  idToken?: string
  subscriptionId?: Identifier
  deviceId?: Identifier,
  rememberMe?: boolean
} 