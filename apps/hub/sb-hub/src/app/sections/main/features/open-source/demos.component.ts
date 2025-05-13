import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { DEMO_APPS } from '../../../../config/demo-apps';
import { HubOpenSourceDemoCardComponent } from './ui/demo-card.component';

@Component({
  selector: 'hub-open-source-demos',
  imports: [MatEverythingModule, HubOpenSourceDemoCardComponent],
  templateUrl: './demos.component.html',
  styleUrl: './demos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubOpenSourceDemosComponent {

  protected _demoApps = signal(DEMO_APPS)

}
