import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, output, PLATFORM_ID, signal } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/ui-mat-notifications/utils';

@Component({
  selector: 'sb-success-modal-mat',
  imports: [MatEverythingModule],
  template: `
  
@if (_successMsg()) {
  <div class="success-modal-backdrop">
    <div class="success-modal">
      <div class="success-modal-header">
        <mat-icon>check</mat-icon>
        <h3>Success</h3>
        <button mat-icon-button 
          (click)="dismissSuccess()" aria-label="Close success modal">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="success-modal-body">
        <p>{{ _successMsg() }}</p>
      </div>
      <div class="success-modal-footer">
        <button mat-button color="warn" 
          (click)="dismissSuccess()">Dismiss</button>
      </div>
    </div>
  </div>
}
  `,
  styles: `
    :host {
      display: block;
    }
    
.success-modal-backdrop {
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

.success-modal {
  width: 90%;
  max-width: 450px;
  background-color: var(--mat-sys-surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

.success-modal-header {
  background-color: var(--mat-sys-primary-container);
  color: var(--mat-sys-on-primary-container);
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
    color: var(--mat-sys-on-success);
  }
}

.success-modal-body {
  padding: 24px;
  color: var(--mat-sys-on-primary-container);
  font-size: 16px;
  line-height: 1.5;
  overflow-x: auto;
  
  p {
    margin: 0;
    white-space: pre-wrap;
  }
}

.success-modal-footer {
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
export class SuccessModalComponent {

  private _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - - - - - //

  _successMsg = signal<string | undefined>(undefined);
  @Input('successMsg')
  set successMsg(message: string | null | undefined) {
    if (!this.isBrowser()) return
    this._successMsg.set(message ?? undefined);
  }

  _dismissSuccess = output({ alias: 'dismiss' });
  _refresh = output({ alias: 'refresh' });

  protected dismissSuccess = () =>
    this._successMsg.set(undefined)

  //--------------------------//
  
  private isBrowser = (): boolean =>    
    isPlatformBrowser(this._platformId)
  
}
