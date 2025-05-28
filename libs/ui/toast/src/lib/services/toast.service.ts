import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, OnInit, inject } from '@angular/core';
import { SbToastComponent } from '../component/toast.component';
import { ToastData, ToastType } from '../toast-data';
import { ToastRef } from '../toast-ref';
import { timer } from 'rxjs';
import { ToastConfig, TOAST_CONFIG_TOKEN } from '@spider-baby/ui-toast/setup';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private overlay = inject(Overlay)
  private parentInjector = inject(Injector)
  private toastConfig: ToastConfig = inject(TOAST_CONFIG_TOKEN)

  private lastToast: ToastRef

  //----------------------------//

  constructor() {

    const positionStrategy = this.getPositionStrategy()
    const overlayRef = this.overlay.create({ positionStrategy })
    this.lastToast = new ToastRef(overlayRef)

  }

  //----------------------------//

  /**
   * Show a toast pop-up
   * @param data Display info and positions
   * @returns A reference the toast container
   */
  show(data: ToastData, durationMillis?: number): ToastRef {

    console.log('ToastData', data);


    const positionStrategy = this.getPositionStrategy()
    const overlayRef = this.overlay.create({ positionStrategy })

    const toastRef = new ToastRef(overlayRef, data)
    this.lastToast = toastRef

    const injector = this.getInjector(data, toastRef, this.parentInjector)
    const toastPortal = new ComponentPortal(SbToastComponent, null, injector)

    overlayRef.attach(toastPortal)


    if (!!durationMillis && durationMillis > 0)
      timer(durationMillis).subscribe(() => toastRef.close())

    return toastRef
  }

  //----------------------------//

  /**
   * Show a toast pop-up
   * @param msg What to say
   * @param toastType Toast type. Affects the color. Default = 'error' (red)
   * @returns ToastRef
   */
  showMsg = (msg: string, toastType: ToastType = 'error', durationMillis = 5000): ToastRef =>
    this.show(new ToastData(toastType, msg), durationMillis)

  //----------------------------//

  getPositionStrategy() {

    return this.overlay
      .position()
      .global()
      .top(this.getPosition())
      .right(this.toastConfig.positionConfig.rightPx + 'px')

  }

  //----------------------------//

  getPosition(): string {

    const lastToastIsVisible = this.lastToast && this.lastToast.isVisible();


    const position = lastToastIsVisible
      ? this.lastToast.getPosition().bottom
      : this.toastConfig.positionConfig.topPx;

    return position + 'px'

  }

  //----------------------------//

  getInjector(data: ToastData, toastRef: ToastRef, parentInjector: Injector) {

    return Injector.create({
      providers: [
        { provide: ToastData, useValue: data },
        { provide: ToastRef, useValue: toastRef },
      ],
      parent: parentInjector
    },)

  }

} //Cls
