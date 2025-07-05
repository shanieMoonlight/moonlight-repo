import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { SbButtonComponent } from '@spider-baby/ui-kit/buttons';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { ForgotPwdModalComponent } from './forgot-pwd-modal.component';
import { ForgotPasswordFormDto } from '@spider-baby/myid-ui/forgot-pwd';


@Component({
  selector: 'sb-forgot-pwd-modal-button',
  standalone: true,
  imports: [
    ForgotPwdModalComponent,
    SbButtonComponent
],
  template: `
    <sb-button
        [color]="color()"
        (click)="_showForgotPwd.set(true)">
        <ng-content/>
    </sb-button>
    <sb-forgot-pwd-modal 
        (forgotPwd)="onForgotPassword($event)"
        [(openModal)]="_showForgotPwd"/>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPwdModalButtonComponent {


  color = input<UiKitTheme>('primary')
  forgotPwd = output<ForgotPasswordFormDto>()
  protected _showForgotPwd = signal(false)

  //--------------------------//

  protected onForgotPassword = (dto: ForgotPasswordFormDto) => 
    this.forgotPwd.emit(dto)

}

