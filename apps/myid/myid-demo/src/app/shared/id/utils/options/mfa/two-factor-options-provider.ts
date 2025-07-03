import { Injectable, InjectionToken, forwardRef, inject } from '@angular/core';

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


export const MY_ID_TWO_FACTOR_OPTIONS_TOKEN = new InjectionToken<TwoFactorOption[]>(
  'MY_ID_TWO_FACTOR_OPTIONS', {
  factory: () => twoFactorProviderOptions
});


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


@Injectable()
export class FallbackTwoFactorOptionsProvider extends MyIdTwoFactorOptionsProvider {

  private _twoFactorProviderOptions = inject(MY_ID_TWO_FACTOR_OPTIONS_TOKEN, { optional: true, }) || []

  override getOptions(): TwoFactorOption[] {
    return this._twoFactorProviderOptions;
  }
}