import { Provider, Type } from '@angular/core';
import { FallbackTeamPositionOptionsProvider, MY_ID_TEAM_POSITION_OPTIONS_TOKEN, MyIdTeamPositionOptionsProvider, TeamPositionOption } from './team-position-options-provider';
// import { MyIdIonicAuthService } from '../services/auth/myid-auth.ionic.service'; // if you have one


export function provideMyIdTeamPositionOptions(options: TeamPositionOption[]): Provider[] {
    console.log('provideMyIdTeamPositionOptions', options);
    return [{
        provide: MY_ID_TEAM_POSITION_OPTIONS_TOKEN,
        useValue: options
    },
    {
        provide: MyIdTeamPositionOptionsProvider,
        useClass: FallbackTeamPositionOptionsProvider //override the root provider
    }];
}

//-------------------//

export function provideMyIdTeamPositionOptionsService(service: Type<MyIdTeamPositionOptionsProvider>): Provider[] {
    console.log('provideMyIdTeamPositionOptionsService', service);
    return [
    {
        provide: MyIdTeamPositionOptionsProvider,
        useClass: service //override the root provider
    }];
}