import { Injectable, InjectionToken, forwardRef, inject } from '@angular/core';

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//

export const MY_ID_TEAM_POSITION_OPTIONS_TOKEN = new InjectionToken<TeamPositionOption[]>(
  'MY_ID_TEAM_POSITION_OPTIONS'
);

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//

export interface TeamPositionOption {
  value: number,
  label: string
}


//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//


@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => FallbackTeamPositionOptionsProvider),
})
export abstract class MyIdTeamPositionOptionsProvider {
  /**Format phone to InternationStandard so it can be used with the like of Twilio*/
  abstract getOptions(): TeamPositionOption[];
}


//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//


@Injectable()
export class FallbackTeamPositionOptionsProvider extends MyIdTeamPositionOptionsProvider {

private   _positionOptions = inject(MY_ID_TEAM_POSITION_OPTIONS_TOKEN, { optional: true, }) || []

  override getOptions(): TeamPositionOption[] {    
    console.log('Using FallbackTeamPositionOptionsProvider', this._positionOptions);
    
    return this._positionOptions;
  }
}