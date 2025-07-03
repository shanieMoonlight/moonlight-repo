import { Injectable, forwardRef } from '@angular/core';

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//

export interface TwoFactorOption {
  value: string,
  label: string
}


const twoFactorProviderOptions: TwoFactorOption[] = [
  { value: 'AuthenticatorApp', label: 'Authenticator App' },
  { value: 'Sms', label: 'SMS' },
  { value: 'Email', label: 'Email' }
]

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//


@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => FallbackTwoFactorOptionsProvider),
})
export abstract class MyIdTwoFactorOptionsProvider {
  /**Format phone to InternationStandard so it can be used with the like of Twilio*/
  abstract getOptions(): TwoFactorOption[];
}


//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//


@Injectable({
  providedIn: 'root',
})
export class FallbackTwoFactorOptionsProvider extends MyIdTwoFactorOptionsProvider {

  override getOptions(): TwoFactorOption[] {
    return twoFactorProviderOptions;
  }
}