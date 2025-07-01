import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { SbButtonComponent } from'@spider-baby/ui-kit/buttons';

@Component({
  selector: 'sb-confirmed-card',
  imports: [SbButtonComponent],
  template: `
          <div class="icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4-4"/>
            </svg>
        </div>
        <h3>{{title()}}</h3>
        <p>{{message()}}</p>
        <sb-button color="primary" 
            (click)="goToLogin()">
            Go to Login
        </sb-button>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--mat-sys-neutral-container) 0%, var(--mat-sys-surface-container) 100%);
      border-radius: 8px;
      box-shadow: 0 4px 24px 0 rgba(60, 72, 88, 0.12);
      padding: 2.5rem 2rem 2rem 2rem;
      max-width: 400px;
      pointer-events: none;
      border: 1.5px solid var(--mat-sys-surface-container-lowest);
    }

    .icon-wrapper {
      color: var(--mat-sys-primary);
      border-radius: 50%;
      padding: 1.2rem;
      margin-bottom: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h3 {
      color: var(--mat-sys-primary);
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      margin-top: 0;
    }

    p {
      color: var(--mat-sys-on-surface-container);  
      font-size: 1.05rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    sb-button {
      margin-top: 0.5rem;
      min-width: 120px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmedCardComponent {

  private _router = inject(MyIdRouter)

  title = input('Confirmed!', {
    transform: (value: string | undefined) => value || 'Confirmed!'
  })

  message = input('Successfully confirmed. You can now log in to your account.', {
    transform: (value: string | undefined) => value || 'Successfully confirmed. You can now log in to your account.'
  })


  goToLogin() {
    console.log('goToLogin');
    this._router.navigateToLogin();

  }
}
