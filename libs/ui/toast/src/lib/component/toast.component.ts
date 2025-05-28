import { AnimationEvent } from '@angular/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TOAST_CONFIG_TOKEN, ToastConfig } from '@spider-baby/ui-toast/setup';
import { ToastAnimationState, dynamicToastAnimation } from '../toast-animations';
import { ToastConstants } from '../toast-constants';
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

  protected readonly data = inject(ToastData)
  private readonly ref = inject(ToastRef)

  //----------------------------//

  protected _toastConfig: ToastConfig = inject(TOAST_CONFIG_TOKEN)
  protected _toastIconError = ToastConstants.IconNameError
  protected _toastIconWarn = ToastConstants.IconNameWarn
  protected _toastIconSuccess = ToastConstants.IconNameSuccess
  protected _toastIconInfo = ToastConstants.IconNameInfo
  protected _toastIconDefault = ToastConstants.IconNameDefault

  //----------------------------//

  protected _bgColor = signal(this._toastConfig.colorBgDefault)
  protected _animationState = signal<ToastAnimationState>(this.data.animationType ?? 'fade')
  protected _iconType = signal('')
  protected _txtColor = signal(this._toastConfig.colorText)
  protected _txt = signal('')
  protected _dismissible = signal(this.data.dismissible)
  protected _showIcon = signal(this.data.showIcon)

  //----------------------------//

  constructor() {
    this.setUp()
  }

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
      this.ref.close();
    }
  }

  //----------------------------//

  private setUp() {
    const data = this.data;

    this._iconType.set(this.getIconName())
    this._bgColor.set(this.getBackgroundColor())
    this._txtColor.set(this.getTextColor())
    this._txt.set(data.text ?? '')
  }

  //----------------------------//


  private getIconName(): string {

    switch (this.data.type) {
      case 'success':
        return ToastConstants.IconNameSuccess;

      case 'info':
        return ToastConstants.IconNameInfo;

      case 'warn':
        return ToastConstants.IconNameWarn;

      case 'error':
        return ToastConstants.IconNameError;

      default:
        return ToastConstants.IconNameDefault;
    }

  }

  //----------------------------//

  private getBackgroundColor(): string {

    const config = this._toastConfig;
    switch (this.data.type) {
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

  private getTextColor(): string {

    const config = this._toastConfig;
    switch (this.data.type) {
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
