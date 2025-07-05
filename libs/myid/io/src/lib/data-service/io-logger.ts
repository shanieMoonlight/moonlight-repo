/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, forwardRef } from "@angular/core";
import { devConsole } from "@spider-baby/dev-console";

//#########################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//#########################################################//

@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => DevConsoleLoggerService),
})
export abstract class MyIdIoLoggerService {
  abstract error(...args: any[]): void;
}


//#########################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//#########################################################//


@Injectable({ providedIn: 'root' })
export class DevConsoleLoggerService extends MyIdIoLoggerService {

  log(...args: any[]) { devConsole.log(...args); }
  
  warn(...args: any[]) { devConsole.warn?.(...args) }

  error(...args: any[]) { devConsole.error?.(...args) }
}