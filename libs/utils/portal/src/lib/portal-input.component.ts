import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, PLATFORM_ID, inject, viewChild } from '@angular/core';
import { SbPortalBridgeService } from './portal-bridge.service';

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

  
  private _portal = viewChild(CdkPortal)


  //----------------------------------//


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this._platformId))
      this._portalBridge.updatePortal(this._portal())
  }


  ngOnDestroy(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._portalBridge.updatePortal(undefined)
      this._portal()?.detach()
    }
  }


}//Cls
