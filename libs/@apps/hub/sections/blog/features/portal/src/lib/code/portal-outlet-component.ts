export const PortalOutletComponentCode = `// portal-outlet.component.ts
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { 
  ChangeDetectionStrategy, 
  Component, 
  OnDestroy, 
  PLATFORM_ID, 
  computed, 
  effect, 
  inject, 
  input, 
  viewChild 
} from '@angular/core';
import { SbPortalBridgeService } from './portal-bridge.service';
import { DEFAULT_NAME } from './portal-constants';

@Component({
  selector: 'sb-portal-outlet',
  standalone: true,
  imports: [PortalModule],
  template: \`<ng-template [cdkPortalOutlet]="attachedPortal()"></ng-template>\`,
  styles: [
    \`
      :host {
        display: block;
      }
    \`,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalOutletComponent implements OnDestroy {

  private _portalBridge = inject(SbPortalBridgeService);
  private _platformId = inject(PLATFORM_ID);

  // Get reference to the CDK portal outlet
  private _portalOutlet = viewChild(CdkPortalOutlet);

  // Input for portal name to display
  _name = input(DEFAULT_NAME, {
    alias: 'name',
    transform: (value: string | undefined | null) => value ?? DEFAULT_NAME
  });

  // Computed signal for the attached portal
  attachedPortal = computed(() => {
    if (!isPlatformBrowser(this._platformId))
      return null;

    const name = this._name();
    return this._portalBridge.getPortal(name);
  });

  constructor() {
    // Effect to handle portal attachment/detachment
    effect(() => {
      if (!isPlatformBrowser(this._platformId))
        return;

      const outlet = this._portalOutlet();
      const portal = this.attachedPortal();

      try {
        if (outlet) {
          if (portal) {
            // Attach the portal if it exists
            if (!outlet.hasAttached()) {
              outlet.attach(portal);
            }
          } else {
            // Detach if no portal
            if (outlet.hasAttached()) {
              outlet.detach();
            }
          }
        }
      } catch (error) {
        console.error('Error managing portal outlet:', error);
      }
    });
  }

  ngOnDestroy(): void {
    const outlet = this._portalOutlet();
    if (outlet?.hasAttached()) {
      try {
        outlet.detach();
      } catch (error) {
        console.error('Error detaching portal on destroy:', error);
      }
    }
  }
}`;
