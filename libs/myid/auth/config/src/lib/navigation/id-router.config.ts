import { Provider, Type } from '@angular/core';
import { MyIdRouter } from './id-router.service';
// import { MyIdIonicAuthService } from '../services/auth/myid-auth.ionic.service'; // if you have one

//-------------------//

export function provideMyIdRouter(service: Type<MyIdRouter>): Provider[] {
    return [
    {
        provide: MyIdRouter,
        useClass: service //override the root provider
    }];
}