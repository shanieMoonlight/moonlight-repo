import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnDestroy, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ANotificationService } from './a-alert-and-notify-service';

@Component({
  selector: 'sb-notifications',
  standalone: true,
  imports: [],
  template: '',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GgWbNotificationsComponent implements OnDestroy{

  private _service = inject(ANotificationService)
  private _destroyer = inject(DestroyRef);

  //- - - - - - - - - - - - - -//

  _onSuccessDismiss = output({ alias: 'successDismiss' })
  _onToastDismiss = output({ alias: 'toastDismiss' })
  _onErrorDismiss = output({ alias: 'errorDismiss' })

  //--------------------------//

  @Input('spinnerOptions') _spinnerOptions?: any


  @Input() set loading(value: boolean | null | undefined) {
    // console.log('setLoading', value);
    this._service
      .showLoader$(!!value, this._spinnerOptions)
      .pipe(takeUntilDestroyed(this._destroyer))
      .subscribe((x) => {
        console.log('setLoadingdddddddddddddd', 'closed', x);
      })
  }

  //- - - - - - - - - - - - - -//

  @Input('errorMsg') set errorMsg(value: string | null | undefined) {
    this._service
      .showErrorMsg$(value ?? undefined)
      .pipe(takeUntilDestroyed(this._destroyer))
      .subscribe((x) => {
        console.log('setErrorMsg', 'closed', x);
        this._onErrorDismiss.emit();
      })
  }

  //- - - - - - - - - - - - - -//

  @Input('tstDurationMillis') _tstDurationMillis = 2000

  protected _successTst = signal<string | undefined>(undefined);
  @Input('successToast') set successTst(value: string | null | undefined) {
    this._service
      .showSuccessToast$(value ?? undefined, this._tstDurationMillis)
      .pipe(takeUntilDestroyed(this._destroyer))
      .subscribe((x) => {
        console.log('setSuccessMsg', 'closed', x, this._onSuccessDismiss);
        this._onToastDismiss.emit();
      })
  }

  //- - - - - - - - - - - - - -//

  protected _successPopup = signal<string | undefined>(undefined);
  @Input('successPopup') set successPopup(value: string | null | undefined) {
    this._service
      .showSuccessPopup$(value ?? undefined)
      .pipe(takeUntilDestroyed(this._destroyer))
      .subscribe((x) => {
        console.log('setSuccessPopup', 'closed', x);
        this._onSuccessDismiss.emit();
      })
  }

  //--------------------------//

  ngOnDestroy(): void {
    console.log('ngOnDestroy')    
    this._service.showLoader$(false)
  }

} //Cls
