import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, PLATFORM_ID, effect, inject, input, viewChild } from '@angular/core';
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
export class SbPortalInputComponent implements OnDestroy {

  private _portalBridge = inject(SbPortalBridgeService);
  private _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - - - - -//

  private _portal = viewChild(CdkPortal)


  _name = input(DEFAULT_NAME, {
    alias: 'name',
    transform: (value: string | undefined | null) => value ?? DEFAULT_NAME
  });

  //-------------------------//

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this._platformId))
        return

      const portal = this._portal();
      const name = this._name();

      if (portal)
        this._portalBridge.updatePortal(name, portal);

    });
  }

  //- - - - - - - - - - - - -//

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this._platformId))
      return

    this._portalBridge.removePortal(this._name())
    this._portal()?.detach()
  }


}//Cls
