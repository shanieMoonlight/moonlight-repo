import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, output, PLATFORM_ID, signal } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/ui-mat-notifications/utils';

@Component({
  selector: 'sb-error-modal-mat',
  imports: [MatEverythingModule],
  template: `
  
@if (_errorMsg()) {
  <div class="error-modal-backdrop">
    <div class="error-modal">
      <div class="error-modal-header">
        <mat-icon>error</mat-icon>
        <h3>Error</h3>
        <button mat-icon-button 
          (click)="dismissError()" aria-label="Close error modal">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="error-modal-body">
        <p>{{ _errorMsg() }}</p>
      </div>
      <div class="error-modal-footer">
        <button mat-button class="error-palette" 
          (click)="dismissError()">Dismiss</button>
        <!-- <button mat-raised-button color="primary" 
          (click)="tryAgain()">Try Again</button> -->
      </div>
    </div>
  </div>
}
  `,
  styles: `
    :host {
      display: block;
    }
    
.error-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.error-modal {
  width: 90%;
  max-width: 450px;
  background-color: var(--mat-sys-surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

.error-modal-header {
  background-color: var(--mat-sys-error-container);
  color: var(--mat-sys-on-error-container);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h3 {
    margin: 0;
    font-weight: 500;
    flex-grow: 1;
    margin-left: 8px;
  }
  
  button {
    color: var(--mat-sys-on-error-container);
  }
}

.error-modal-body {
  padding: 24px;
  color: var(--mat-sys-on-surface);
  font-size: 16px;
  line-height: 1.5;
  
  p {
    margin: 0;
    white-space: pre-wrap;
  }
}

.error-modal-footer {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid var(--mat-sys-outline-variant);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorModalComponent {

  private _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - - - - - //
  
  _errorMsg = signal<string | undefined>(undefined);  
  @Input('errorMsg')
  set errorMsg(message: string | null | undefined) {
    if (!this.isBrowser()) return
    this._errorMsg.set(message ?? undefined);
  }

  //- - - - - - - - - - - - - - //

  _dismissError = output({ alias: 'dismiss' })

  //----------------------------//

  protected dismissError(): void {    
    this._errorMsg.set(undefined)
    console.log('dismissError', this._errorMsg());
    
  }
  
  //--------------------------//
  
  private isBrowser = (): boolean =>    
    isPlatformBrowser(this._platformId)
  
  //--------------------------//

}//Cls
