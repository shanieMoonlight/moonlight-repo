import { forwardRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SbConsoleNotificationService } from './alert-and-notify.service';

@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => SbConsoleNotificationService), // Default implementation.
})
export abstract class ANotificationService {

  abstract showLoader$(isLoading: boolean, spinnerOpts?: any): Observable<any>;
  abstract showErrorMsg$(errorMsg?: string, errorOpts?: any): Observable<any>;
  abstract showSuccessToast$(successMsg?: string, durationMillis?: number, toastOpts?: any): Observable<any>;
  abstract showSuccessPopup$(successMsg?: string, successOpts?: any): Observable<any>;

}
