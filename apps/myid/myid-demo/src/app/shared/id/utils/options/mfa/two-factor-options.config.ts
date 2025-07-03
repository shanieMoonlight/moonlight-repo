import { Provider, Type } from '@angular/core';
import { FallbackTwoFactorOptionsProvider, MY_ID_TWO_FACTOR_OPTIONS_TOKEN, MyIdTwoFactorOptionsProvider, TwoFactorOption } from './two-factor-options-provider';
// import { MyIdIonicAuthService } from '../services/auth/myid-auth.ionic.service'; // if you have one


export function provideMyIdTwoFactorOptions(options: TwoFactorOption[]): Provider[] {
    return [{
        provide: MY_ID_TWO_FACTOR_OPTIONS_TOKEN,
        useValue: options
    },
    {
        provide: MyIdTwoFactorOptionsProvider,
        useClass: FallbackTwoFactorOptionsProvider //override the root provider
    }];
}

//-------------------//

export function provideMyIdTwoFactorOptionsService(service: Type<MyIdTwoFactorOptionsProvider>): Provider[] {
    return [
    {
        provide: MyIdTwoFactorOptionsProvider,
        useClass: service //override the root provider
    }];
}