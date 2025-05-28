import { AnimationEvent } from '@angular/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TOAST_CONFIG_TOKEN, ToastConfig } from '@spider-baby/ui-toast/setup';
import { ToastAnimationState, dynamicToastAnimation } from '../toast-animations';
import { ToastData } from '../toast-data';
import { ToastRef } from '../toast-ref';


@Component({
  selector: 'sb-tst',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    dynamicToastAnimation
  ],
  standalone: true,
  imports: [
    OverlayModule,
    NgTemplateOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbToastComponent {

  private readonly _data = inject(ToastData)
  private readonly _ref = inject(ToastRef)

  //- - - - - - - - - - - - - - //

  protected _toastConfig: ToastConfig = inject(TOAST_CONFIG_TOKEN)

  //- - - - - - - - - - - - - - //

  protected _bgColor = signal(this.getBackgroundColor(this._data, this._toastConfig))
  protected _txtColor = signal(this.getTextColor(this._data, this._toastConfig))

  protected _txt = signal(this._data.text ?? '')
  
  protected _toastType = signal(this._data.type)
  protected _animationState = signal<ToastAnimationState>(this._data.animationType ?? 'fade')
  
  protected _dismissible = signal(this._data.dismissible)
  protected _showIcon = signal(this._data.showIcon)

  //----------------------------//

  close = () =>
    this._animationState.set('closing') //trigger animation

  //----------------------------//

  /**
   * Handles animation completion events for all animation types
   */
  protected onAnimationFinished(event: AnimationEvent) {

    const { toState } = event;
    const isClosing = (toState as ToastAnimationState) === 'closing';
    const animationStateIsClosing = this._animationState() === 'closing';

    if (isClosing && animationStateIsClosing) {
      this._ref.close();
    }
  }

  //----------------------------//

  private getBackgroundColor(data: ToastData, config: ToastConfig): string {
    
    switch (data.type) {
      case 'success':
        return config.colorBgSuccess;

      case 'info':
        return config.colorBgInfo;

      case 'warn':
        return config.colorBgWarn;

      case 'error':
        return config.colorBgError;

      default:
        return config.colorBgDefault;
    }

  }

  //----------------------------//

  private getTextColor(data: ToastData, config: ToastConfig): string {

    switch (data.type) {
      case 'success':
        return config.colorTxtSuccess;

      case 'info':
        return config.colorTxtInfo;

      case 'warn':
        return config.colorTxtWarn;

      case 'error':
        return config.colorTxtError;

      default:
        return config.colorText;
    }

  }

} //Cls
