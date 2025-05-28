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

  private lastToast: ToastRef

  private readonly activeToasts = new Set<ToastRef>()

  //----------------------------//

  constructor() {

    const positionStrategy = this.getPositionStrategy('top')
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

    // Use the position from ToastData options, fallback to default 'top'
    const positionStrategy = this.getPositionStrategy(data.position)
    const overlayRef = this.overlay.create({ positionStrategy })

    const toastRef = new ToastRef(overlayRef, data)
    this.lastToast = toastRef

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

    overlayRef.attach(toastPortal)


    if (!!durationMillis && durationMillis > 0)
      timer(durationMillis).subscribe(() => toastRef.close())

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

  getPositionStrategy(position?: 'top' | 'bottom' | 'center') {
    const positionBuilder = this.overlay.position().global();
    const rightOffset = this.toastConfig.positionConfig.rightPx + 'px';

    switch (position) {
      case 'bottom':
        return positionBuilder
          .bottom(this.getBottomPosition())
          .right(rightOffset);

      case 'center':
        return positionBuilder
          // .centerHorizontally()
          .centerVertically();

      case 'top':
      default:
        return positionBuilder
          .top(this.getTopPosition())
          .right(rightOffset);
    }
  }

  //----------------------------//

  getTopPosition(): string {
    const lastToastIsVisible = this.lastToast && this.lastToast.isVisible();
    const position = lastToastIsVisible
      ? this.lastToast.getPosition().bottom
      : this.toastConfig.positionConfig.topPx;
    return position + 'px';
  }

  //----------------------------//

  getCenterPosition(): { x: string, y: string } {
    // Center positioning uses overlay's built-in centering
    // but we can provide offset calculations if needed
    return { x: '0px', y: '0px' };
  }

  //----------------------------//

  getBottomPosition(): string {
    // For bottom positioning, calculate from bottom up
    // Stack toasts from bottom with proper spacing
    const bottomToasts = Array.from(this.activeToasts).filter(
      toast => toast.data?.position === 'bottom'
    );
    
    const baseBottomPx = this.toastConfig.positionConfig.bottomPx;
    const toastHeight = 60; // Approximate height per toast
    const spacing = 10; // Space between toasts
    
    return (baseBottomPx + (bottomToasts.length * (toastHeight + spacing))) + 'px';
  }

  //----------------------------//

  // Legacy method for backward compatibility
  getPosition(): string {
    return this.getTopPosition();
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
