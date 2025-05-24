import { PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbPortalBridgeService } from './portal-bridge.service';

@Component({
  selector: 'sb-portal-outlet',
  standalone: true,
  imports: [PortalModule],
  template: `
  @if(_portal.cdkPortal(); as portal){
    <ng-container [cdkPortalOutlet]="portal"/>
  }
  `,
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalOutletComponent {

  protected _portal = inject(SbPortalBridgeService)

}
