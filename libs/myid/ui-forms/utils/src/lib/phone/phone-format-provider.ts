import { Injectable, InjectionToken, forwardRef, inject } from '@angular/core';
import { CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js';
import { DefaultPhoneCode, PhoneCountryCode } from './country-codes';
import {devConsole } from '@spider-baby/dev-console';

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//


export const DEFAULT_PHONE_CODE = new InjectionToken<PhoneCountryCode>(
  'default-phone-code',
  {
    providedIn: 'root',
    factory: () => DefaultPhoneCode, // fallback value here
  }
);



@Injectable({
  providedIn: 'root',
})
export class DefaultPhoneCodeProvider {

  private _defaultCode = inject(DEFAULT_PHONE_CODE)

  public get code(): PhoneCountryCode {
    return this._defaultCode
  }

}

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//


@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => FallbackPhoneFormatProvider),
})
export abstract class MyIdPhoneFormatProvider {
  /**Format phone to InternationStandard so it can be used with the like of Twilio*/
  abstract formatPhoneInternational(phone: string): string;
}


//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//


@Injectable({
  providedIn: 'root',
})
export class FallbackPhoneFormatProvider implements MyIdPhoneFormatProvider {

  private _codeProvider = inject(DefaultPhoneCodeProvider)

  formatPhoneInternational(phone: string, intCode?: PhoneCountryCode): string {
    if (!phone)
      return phone;

    try {
      const libCode = this.toLibPhoneCountryCode(intCode ?? this._codeProvider.code)
      const number = parsePhoneNumberWithError(phone, libCode)
      return number ? number.formatInternational() : phone;

    } catch(error:any) {
      //ignore bad numbers
    devConsole.log(error.message)
      return phone;
    }
  }

  //-----------------------//

  private toLibPhoneCountryCode = (myCode: PhoneCountryCode): CountryCode =>
    (myCode as CountryCode) ?? DefaultPhoneCode

}