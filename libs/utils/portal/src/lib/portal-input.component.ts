import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { SbPortalBridgeService } from './portal-bridge.service';

@Component({
  selector: 'sb-portal',
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
export class SbPortalInputComponent implements OnInit, OnDestroy {

  private _portalBridge = inject(SbPortalBridgeService)
    
  private _portal = viewChild( CdkPortal)


  //----------------------------------//

  ngOnInit(): void {    

    this._portalBridge.setPortal(this._portal())    
    
  }
    
  ngOnDestroy(): void {
    this._portalBridge.setPortal(undefined)
    this._portal()?.detach()
  }


}//Cls
