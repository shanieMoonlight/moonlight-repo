import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ErrorModalComponent } from '@spider-baby/mat-notifications/error';
import { SbMatLoaderModalComponent } from '@spider-baby/mat-notifications/loader';
import { SuccessModalComponent } from '@spider-baby/mat-notifications/success';
import { SbMatToastModalComponent as SbMatToastComponent } from '@spider-baby/mat-notifications/toast';

@Component({
  selector: 'sb-notifications-modal-mat',
  imports: [
    ErrorModalComponent,
    SuccessModalComponent,
    ErrorModalComponent,
    SbMatLoaderModalComponent,
    SbMatToastComponent
  ],
  template: ` 
    <sb-error-modal-mat 
        [errorMsg]="_errorMsg()"/>

    <sb-success-modal-mat 
        [successMsg]="_successMsg()"/>

    <sb-loader-modal-mat [isLoading]="_isLoading()" 
        [loadingMsg]="_loadingMsg()"/>    

    <sb-toast-mat
        [toastMsg]="_toastMsg()"/>    
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbMatNotificationsModalComponent {

  _successMsg = input<string | undefined>(undefined, { alias: 'successMsg' });
  _errorMsg = input<string | undefined>(undefined, { alias: 'errorMsg' })
  _toastMsg = input<string | undefined>(undefined, { alias: 'toastMsg' })
  _loadingMsg = input<string | undefined>(undefined, { alias: 'loadingMessage' });
  _isLoading = input<boolean>(false, { alias: 'isLoading' })
  
}
