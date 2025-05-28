import { GlobalPositionStrategy, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DestroyRef, Injectable, Injector, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TOAST_CONFIG_TOKEN, ToastConfig } from '@spider-baby/ui-toast/setup';
import { timer } from 'rxjs';
import { SbToastComponent } from '../component/toast.component';
import { ToastData, ToastOptions, ToastType } from '../toast-data';
import { ToastRef } from '../toast-ref';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private overlay = inject(Overlay)
  private parentInjector = inject(Injector)
  private destroyer = inject(DestroyRef)
  private toastConfig: ToastConfig = inject(TOAST_CONFIG_TOKEN)

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
        console.log('closing', toastRef)        
        this.activeToasts.delete(toastRef);
      });

    const injector = this.getInjector(data, toastRef, this.parentInjector)
    const toastPortal = new ComponentPortal(SbToastComponent, null, injector)

    const componentRef = overlayRef.attach(toastPortal)


    if (!!durationMillis && durationMillis > 0) {
      timer(durationMillis).subscribe(() =>
        componentRef.instance.close())
    }

    return toastRef
  }

  //----------------------------//


  /**
   * Shows a success toast notification
   * @param message The message to display in the toast
   * @param duration Duration in milliseconds to show the toast (default: 5000ms)
   * @param options Additional configuration options
   * @returns A reference to the created toast
   */
  success = (message: string, duration = 5000, options: ToastOptions = {}): ToastRef =>
    this.show(ToastData.Success(message, options), duration)

  /**
   * Shows an error toast notification
   * @param message The message to display in the toast
   * @param duration Duration in milliseconds to show the toast (default: 8000ms)
   * @param options Additional configuration options
   * @returns A reference to the created toast
   */
  error = (message: string, duration = 8000, options: ToastOptions = {}): ToastRef =>
    this.show(ToastData.Error(message, options), duration)

  /**
   * Shows a warning toast notification
   * @param message The message to display in the toast
   * @param duration Duration in milliseconds to show the toast (default: 6000ms)
   * @param options Additional configuration options
   * @returns A reference to the created toast
   */
  warning = (message: string, duration = 6000, options: ToastOptions = {}): ToastRef =>
    this.show(ToastData.Warning(message, options), duration)

  /**
   * Shows an info toast notification
   * @param message The message to display in the toast
   * @param duration Duration in milliseconds to show the toast (default: 5000ms)
   * @param options Additional configuration options
   * @returns A reference to the created toast
   */
  info = (message: string, duration = 5000, options: ToastOptions = {}): ToastRef =>
    this.show(ToastData.Info(message, options), duration)


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
   * @returns The number of currently active toast notifications
   */
  getActiveCount = (): number =>
    this.activeToasts.size


  //----------------------------//

  /**
   * Show a toast pop-up
   * @param msg What to say
   * @param toastType Toast type. Affects the color. Default = 'error' (red)
   * @param durationMillis Duration in milliseconds to show the toast (default: 5000ms)
   * @returns A reference to the created toast
   */
  showMsg = (msg: string, toastType: ToastType = 'error', durationMillis = 5000): ToastRef =>
    this.show(new ToastData(toastType, msg), durationMillis)


  //----------------------------//


  private getPositionStrategy(data: ToastData): GlobalPositionStrategy {
    const positionBuilder = this.overlay.position().global();
    const verticalPos = data.positionVertical;
    const horizontalPos = data.positionHorizontal;



    if (verticalPos === 'center')
      positionBuilder.centerVertically()
    else if (verticalPos === 'top')
      positionBuilder.top(this.getTopPosition())
    else if (verticalPos === 'bottom')
      positionBuilder.bottom(this.getBottomPosition());

    if (horizontalPos === 'center')
      positionBuilder.centerHorizontally();
    else if (horizontalPos === 'left')
      positionBuilder.left(this.getLeftPosition());
    else if (horizontalPos === 'right')
      positionBuilder.right(this.getRightPosition());


    return positionBuilder;
  }

  //----------------------------//


  private getTopPosition = (): string =>
    this.toastConfig.positionConfig.topPx + 'px'

  private getBottomPosition = (): string =>
    this.toastConfig.positionConfig.bottomPx + 'px'

  private getRightPosition = (): string =>
    this.toastConfig.positionConfig.rightPx + 'px'

  private getLeftPosition = (): string =>
    this.toastConfig.positionConfig.leftPx + 'px'


  //----------------------------//


  private getInjector(data: ToastData, toastRef: ToastRef, parentInjector: Injector) {

    return Injector.create({
      providers: [
        { provide: ToastData, useValue: data },
        { provide: ToastRef, useValue: toastRef },
      ],
      parent: parentInjector
    })
  }

} //Cls
