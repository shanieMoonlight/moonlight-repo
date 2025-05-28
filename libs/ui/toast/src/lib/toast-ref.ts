import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { ToastData } from './toast-data';

export class ToastRef {
  
  private readonly _afterClosed = new Subject<void>();

  constructor(
    private readonly overlay: OverlayRef, 
    public data?: ToastData
  ) { }

  //---------------------------------//

  close = () => {
    this.overlay.dispose();
    this._afterClosed.next();
    this._afterClosed.complete();
  }

  afterClosed(): Observable<void> {
    return this._afterClosed.asObservable();
  }

  isVisible = () =>
    this.overlay && this.overlay.overlayElement

  getPosition = () =>
    this.overlay.overlayElement?.getBoundingClientRect?.() ?? 0

} //Cls
