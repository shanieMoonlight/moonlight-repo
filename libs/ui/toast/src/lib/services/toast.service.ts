import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DestroyRef, Injectable, Injector, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TOAST_CONFIG_TOKEN, ToastConfig } from '@spider-baby/ui-toast/setup';
import { timer } from 'rxjs';
import { SbToastComponent } from '../component/toast.component';
import { ToastData, ToastType } from '../toast-data';
import { ToastRef } from '../toast-ref';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private overlay = inject(Overlay)
  private parentInjector = inject(Injector)
  private destroyer = inject(DestroyRef)
  private toastConfig: ToastConfig = inject(TOAST_CONFIG_TOKEN)

  // private lastToast: ToastRef

  private readonly activeToasts = new Set<ToastRef>()

  //----------------------------//

  /**
   * Show a toast pop-up
   * @param data Display info and positions
   * @returns A reference the toast container
   */
  show(data: ToastData, durationMillis?: number): ToastRef {


    // Use the new positioning system
    const positionStrategy = this.getPositionStrategy(data)
    const overlayRef = this.overlay.create({ positionStrategy })

    const toastRef = new ToastRef(overlayRef, data)

    // Track active toasts
    this.activeToasts.add(toastRef);

    // Clean up when toast closes
    toastRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyer))
      .subscribe(() => {
        this.activeToasts.delete(toastRef);
      });

    const injector = this.getInjector(data, toastRef, this.parentInjector)
    const toastPortal = new ComponentPortal(SbToastComponent, null, injector)

    const componentRef = overlayRef.attach(toastPortal)


    if (!!durationMillis && durationMillis > 0) {
      timer(durationMillis).subscribe(() => 
        componentRef.instance.close()
    )
    }

    return toastRef
  }

  //----------------------------//

  success = (message: string, duration = 5000): ToastRef =>
    this.show(ToastData.Create('success', message), duration)

  error = (message: string, duration = 8000): ToastRef =>
    this.show(ToastData.Create('error', message), duration)

  warning = (message: string, duration = 6000): ToastRef =>
    this.show(ToastData.Create('warn', message), duration)

  info = (message: string, duration = 5000): ToastRef =>
    this.show(ToastData.Create('info', message), duration)

  //----------------------------//

  // Enhanced positioning methods
  showTopLeft = (message: string, type: ToastType = 'info', duration = 5000): ToastRef =>
    this.show(ToastData.TopLeft(type, message), duration)

  showTopRight = (message: string, type: ToastType = 'info', duration = 5000): ToastRef =>
    this.show(ToastData.TopRight(type, message), duration)

  showTopCenter = (message: string, type: ToastType = 'info', duration = 5000): ToastRef =>
    this.show(ToastData.TopCenter(type, message), duration)

  showBottomLeft = (message: string, type: ToastType = 'info', duration = 5000): ToastRef =>
    this.show(ToastData.BottomLeft(type, message), duration)

  showBottomRight = (message: string, type: ToastType = 'info', duration = 5000): ToastRef =>
    this.show(ToastData.BottomRight(type, message), duration)

  showBottomCenter = (message: string, type: ToastType = 'info', duration = 5000): ToastRef =>
    this.show(ToastData.BottomCenter(type, message), duration)

  showCenter = (message: string, type: ToastType = 'error', duration = 8000): ToastRef =>
    this.show(ToastData.Center(type, message), duration)

  //----------------------------//

  /**
   * Clear all active toasts
   */
  clearAll(): void {
    this.activeToasts.forEach(toast => toast.close());
    this.activeToasts.clear();
  }

  //----------------------------//

  /**
   * Get count of active toasts
   */
  getActiveCount = (): number =>
    this.activeToasts.size

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

  getPositionStrategy(data: ToastData) {
    const positionBuilder = this.overlay.position().global();
    const verticalPos = data.positionVertical;
    const horizontalPos = data.positionHorizontal;



    // Handle vertical positioning for non-center cases
    if (verticalPos === 'center')
      positionBuilder.centerVertically()
    else if (verticalPos === 'top')
      positionBuilder.top(this.getTopPosition())
    else if (verticalPos === 'bottom')
      positionBuilder.bottom(this.getBottomPosition());


    // Handle horizontal positioning for non-center cases
    if (horizontalPos === 'center')
      positionBuilder.centerHorizontally();
    else if (horizontalPos === 'left')
      positionBuilder.left(this.getLeftPosition());
    else if (horizontalPos === 'right')
      positionBuilder.right(this.getRightPosition());


    return positionBuilder;
  }

  //----------------------------//

  getTopPosition(): string {
    return this.toastConfig.positionConfig.topPx + 'px';
  }
  getBottomPosition(): string {
    return this.toastConfig.positionConfig.bottomPx + 'px';
  }

  getRightPosition(): string {
    return this.toastConfig.positionConfig.rightPx + 'px';
  }
  getLeftPosition(): string {
    return this.toastConfig.positionConfig.leftPx + 'px';
  }

  //----------------------------//

  getInjector(data: ToastData, toastRef: ToastRef, parentInjector: Injector) {

    return Injector.create({
      providers: [
        { provide: ToastData, useValue: data },
        { provide: ToastRef, useValue: toastRef },
      ],
      parent: parentInjector
    })
  }

} //Cls
