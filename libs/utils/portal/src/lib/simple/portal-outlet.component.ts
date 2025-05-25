import { PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SbPortalBridgeService } from './portal-bridge.service';

@Component({
  selector: 'sb-portal-outlet',
  standalone: true,
  imports: [PortalModule],
  template: `
  @if(_portal.portal(); as portal){
    <ng-template [cdkPortalOutlet]="portal"/>
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
  
  private static _count = 1
 protected count = computed(() =>  SbPortalOutletComponent._count++)

  /**
   *
   */
  constructor() {
    console.log('SbPortalOutletComponent initialized with name:', this.count());
    
  }

}