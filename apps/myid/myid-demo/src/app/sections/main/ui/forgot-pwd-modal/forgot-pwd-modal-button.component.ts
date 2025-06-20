import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ForgotPasswordFormDto } from '../../../../shared/id/ui/forms/forgot-pwd/forgot-pwd.component';
import { SbButtonComponent } from "../../../../shared/ui/buttons";
import { IdTheme } from '../../../../shared/ui/theme.type';
import { ForgotPwdModalComponent } from './forgot-pwd-modal.component';

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


  color = input<IdTheme>('primary')
  forgotPwd = output<ForgotPasswordFormDto>()
  protected _showForgotPwd = signal(false)

  //--------------------------//

  protected onForgotPassword(dto: ForgotPasswordFormDto) {
    console.log('ForgotPwdModalButtonComponent.onForgotPassword', dto);
    
    this.forgotPwd.emit(dto);
  }

}

