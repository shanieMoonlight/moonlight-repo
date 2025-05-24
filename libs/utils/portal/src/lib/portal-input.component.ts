import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, PLATFORM_ID, effect, inject, input, viewChild } from '@angular/core';
import { SbPortalBridgeService } from './portal-bridge.service';
import { DEFAULT_NAME } from './portal-constants';

@Component({
  selector: 'sb-portal-input',
  standalone: true,
  imports: [PortalModule],
  template: `
  <ng-container *cdkPortal>
    <ng-content/>
  </ng-container>
  `,
  styles: [
    `
      :host {
        position: relative;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalInputComponent implements AfterViewInit, OnDestroy {

  private _portalBridge = inject(SbPortalBridgeService);
  private _platformId = inject(PLATFORM_ID)
  private _destroyor = inject(DestroyRef)

  //- - - - - - - - - - - - - - - //

  private _portal = viewChild(CdkPortal)


  _name = input(DEFAULT_NAME, {
    alias: 'name',
    transform: (value: string | undefined | null) => value ?? DEFAULT_NAME
  });
  private _name$ = toObservable(this._name);



  //------------------------------//


  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this._platformId))
      return

    this._name$
      .pipe(takeUntilDestroyed(this._destroyor))
      .subscribe((name) => {
        this._portalBridge.updatePortal(name, this._portal())
      })
  }

  //- - - - - - - - - - - - - - - //


  ngOnDestroy(): void {
    if (!isPlatformBrowser(this._platformId))
      return

    this._portalBridge.removePortal(this._name())
    this._portal()?.detach()
  }


}//Cls
