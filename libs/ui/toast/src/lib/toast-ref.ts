import { OverlayRef } from '@angular/cdk/overlay';
import { ToastData } from './toast-data';

export class ToastRef {

  constructor(
    private readonly overlay:
      OverlayRef, public data?: ToastData) { }

  //---------------------------------//

  close = () =>
    this.overlay.dispose()


  isVisible = () =>
    this.overlay && this.overlay.overlayElement


  getPosition = () =>
    this.overlay.overlayElement?.getBoundingClientRect?.() ?? 0

} //Cls
