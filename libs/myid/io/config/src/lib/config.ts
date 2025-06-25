import { InjectionToken } from '@angular/core';

//############################//

export const MyIdIoConfigService = new InjectionToken<MyIdIoConfig>(
  'MyIdIoConfig',
  {
    factory: () => MyIdIoConfig.create({baseUrl: '/identity'})
  }
)


//############################//

/** Interface for ThemeConfig creation options */
export interface MyIdIoConfigOptions {
  /** CSS class for dark mode */
  baseUrl: string;
}

//############################//


export class MyIdIoConfig {

  baseUrl: string

  //- - - - - - - - - - -//

  private constructor(options: MyIdIoConfigOptions) {
    this.baseUrl = options.baseUrl;
  }

  //- - - - - - - - - - -//

  static create(options: MyIdIoConfigOptions): MyIdIoConfig {
    return new MyIdIoConfig(options)
  }

} //Cls
