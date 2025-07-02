import { Injectable, forwardRef } from '@angular/core';

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//

export interface TeamPositionOption {
  value: string,
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


@Injectable({
  providedIn: 'root',
})
export class FallbackTeamPositionOptionsProvider extends MyIdTeamPositionOptionsProvider {

  override getOptions(): TeamPositionOption[] {
    return [];
  }
}