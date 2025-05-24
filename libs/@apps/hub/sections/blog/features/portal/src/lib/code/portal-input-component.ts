export const PortalInputComponentCode = `// portal-input.component.ts
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { 
  ChangeDetectionStrategy, 
  Component, 
  OnDestroy, 
  PLATFORM_ID, 
  effect, 
  inject, 
  input, 
  viewChild 
} from '@angular/core';
import { SbPortalBridgeService } from './portal-bridge.service';
import { DEFAULT_NAME } from './portal-constants';

@Component({
  selector: 'sb-portal-input',
  standalone: true,
  imports: [PortalModule],
  template: \`
  <ng-container *cdkPortal>
    <ng-content/>
  </ng-container>
  \`,
  styles: [
    \`
      :host {
        position: relative;
      }
    \`,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalInputComponent implements OnDestroy {

  private _portalBridge = inject(SbPortalBridgeService);
  private _platformId = inject(PLATFORM_ID);

  // Get reference to the CDK portal
  private _portal = viewChild(CdkPortal);

  // Input for portal name with default value
  _name = input(DEFAULT_NAME, {
    alias: 'name',
    transform: (value: string | undefined | null) => value ?? DEFAULT_NAME
  });

  constructor() {
    // React to changes in portal or name
    effect(() => {
      if (!isPlatformBrowser(this._platformId))
        return;

      const portal = this._portal();
      const name = this._name();

      try {
        if (portal && name) {
          // Register the portal with the bridge service
          this._portalBridge.setPortal(name, portal);
        }
      } catch (error) {
        console.error('Error setting portal:', error);
      }
    });
  }

  ngOnDestroy(): void {
    const name = this._name();
    if (name) {
      // Clean up portal registration
      this._portalBridge.removePortal(name);
    }
  }
}`;
