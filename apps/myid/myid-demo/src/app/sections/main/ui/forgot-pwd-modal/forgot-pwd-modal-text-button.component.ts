import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { SbTextButtonComponent } from '@spider-baby/ui-kit/buttons';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { ForgotPasswordFormDto } from '../../../../shared/id/ui/forms/forgot-pwd/forgot-pwd.component';
import { ForgotPwdModalComponent } from './forgot-pwd-modal.component';

@Component({
  selector: 'sb-forgot-pwd-modal-text-button',
  standalone: true,
  imports: [
    ForgotPwdModalComponent,
    SbTextButtonComponent
],
  template: `
    <sb-text-button
        [color]="color()"
        (click)="_showForgotPwd.set(true)">
        <ng-content/>
    </sb-text-button>
    <sb-forgot-pwd-modal 
        (forgotPwd)="onForgotPassword($event)"
        [(openModal)]="_showForgotPwd"/>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPwdModaTextlButtonComponent {


  color = input<UiKitTheme>('primary')
  forgotPwd = output<ForgotPasswordFormDto>()
  protected _showForgotPwd = signal(false)

  //--------------------------//

  protected onForgotPassword(dto: ForgotPasswordFormDto) {
    console.log('ForgotPwdModalButtonComponent.onForgotPassword', dto);
    
    this.forgotPwd.emit(dto);
  }

}

