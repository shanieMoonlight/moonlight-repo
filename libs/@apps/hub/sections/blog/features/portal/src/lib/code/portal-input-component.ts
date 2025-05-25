export const PortalInputComponentCode = `// portal-input.component.ts
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { 
  ChangeDetectionStrategy, 
  Component, 
  OnDestroy, 
  PLATFORM_ID, 
  TemplateRef,
  ViewContainerRef,
  effect, 
  inject, 
  input,
  toObservable
} from '@angular/core';
import { combineLatest } from 'rxjs';
import { SbPortalBridgeService } from './portal-bridge.service';
import { DEFAULT_NAME } from './portal-constants';

@Component({
  selector: 'sb-portal-input',
  standalone: true,
  template: \`<!-- Portal input renders nothing directly -->\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalInputComponent implements OnDestroy {

  private _portalBridge = inject(SbPortalBridgeService);
  private _platformId = inject(PLATFORM_ID);
  private _viewContainer = inject(ViewContainerRef);

  // Required template input
  portalTemplate = input.required<TemplateRef<unknown>>();

  // Input for portal name with default value
  name = input(DEFAULT_NAME, {
    transform: (value: string | undefined | null) => value ?? DEFAULT_NAME
  });

  constructor() {
    // React to changes in template or name
    effect(() => {
      if (!isPlatformBrowser(this._platformId))
        return;

      const template = this.portalTemplate();
      const portalName = this.name();

      try {
        if (template && portalName) {
          // Create a template portal from the TemplateRef
          const templatePortal = new TemplatePortal(
            template,
            this._viewContainer
          );
          
          // Register the portal with the bridge service
          this._portalBridge.setPortal(portalName, templatePortal);
        }
      } catch (error) {
        console.error('Error setting portal:', error);
      }
    });
  }

  ngOnDestroy(): void {
    const portalName = this.name();
    if (portalName) {
      // Clean up portal registration
      this._portalBridge.removePortal(portalName);
    }
  }
}`;
