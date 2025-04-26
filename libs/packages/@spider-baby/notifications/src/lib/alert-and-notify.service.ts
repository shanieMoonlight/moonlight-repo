import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ANotificationService } from './a-alert-and-notify-service';
import { SbNotificationStatusService } from './alert-and-notify-status.service';

//###########################################################//

export const DEFAULT_TOAST_DURATION_MILLIS = 2000;

//###########################################################//

@Injectable({
  providedIn: 'root',
})
export class SbConsoleNotificationService extends ANotificationService { 

  private _status = inject(SbNotificationStatusService);

  //---------------------------//

  override showLoader$(isLoading: boolean, spinnerOpts:any): Observable<any> {
    this._status.setIsLoading(isLoading)
    console.log('showLoader$', isLoading, spinnerOpts)
    return of(isLoading)
  }

  //---------------------------//

  override showErrorMsg$(errorMsg?: string): Observable<any> {
    this._status.setErrorMsg(errorMsg)
    console.log('showErrorMsg$', errorMsg)
    return of(errorMsg)
      .pipe(delay(2000))
  }

  //---------------------------//

  override showSuccessToast$(successMsg?: string, durationMillis = DEFAULT_TOAST_DURATION_MILLIS): Observable<any> {
    this._status.setSuccessMsg(successMsg)
    console.log('showSuccessToast$', successMsg)

    return of(successMsg)
      .pipe(delay(durationMillis))
  }
  //---------------------------//

  override showSuccessPopup$(successMsg?: string): Observable<any> {

    this._status.setSuccessMsg(successMsg)
    console.log('showSuccessPopup$', successMsg)
    return of(successMsg)
      .pipe(delay(2000))
  }

}//Cls
