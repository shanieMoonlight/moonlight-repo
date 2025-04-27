import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ErrorModalComponent } from '../error/error.component';
import { LoaderModalComponent } from '../loader/loader.component';
import { SuccessModalComponent } from '../success/success.component';

@Component({
  selector: 'sb-notifications-modal',
  imports: [
    ErrorModalComponent,
    SuccessModalComponent,
    ErrorModalComponent,
    LoaderModalComponent
  ],
  template: ` 
    <sb-error-modal 
        [errorMsg]="_errorMsg()"/>

    <sb-success-modal 
        [successMsg]="_successMsg()"/>

    <sb-loader-modal [isLoading]="_isLoading()" 
        [loadingMessage]="'Loading albums...'"/>    
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsModalComponent {

  _successMsg = input<string | undefined>(undefined, { alias: 'successMsg' });
  _errorMsg = input<string | undefined>(undefined, { alias: 'errorMsg' })
  _loadingMessage = input<string | undefined>(undefined, { alias: 'loadingMessage' });
  _isLoading = input<boolean>(false, { alias: 'isLoading' })
}
