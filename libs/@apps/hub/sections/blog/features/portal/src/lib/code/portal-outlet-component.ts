export const PortalOutletComponentCode = `// portal-outlet.component.ts
import { PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SbPortalBridgeService } from './portal-bridge.service';
import { DEFAULT_NAME } from './portal-constants';

@Component({
  selector: 'sb-portal-outlet',
  standalone: true,
  imports: [PortalModule],
  template: \`
  @if(_portal(); as portal){
    <ng-template [cdkPortalOutlet]="portal"/>
  }
  \`,
  styles: [
    \`
      :host {
        display: flex;
      }
    \`,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbPortalOutletComponent {

  protected _bridge = inject(SbPortalBridgeService)

  //- - - - - - - - - - - - -//

  _name = input(DEFAULT_NAME, {
    alias: 'name',
    transform: (value: string | undefined | null) => value ?? DEFAULT_NAME
  })

  protected _portal = this._bridge.getPortal(this._name)
}`;
