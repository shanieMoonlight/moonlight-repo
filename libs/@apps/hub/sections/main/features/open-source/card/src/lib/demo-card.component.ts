import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DemoAppData } from '@sb-hub/core-config/demo-apps';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';

@Component({
  selector: 'hub-open-source-demo-card',
  imports: [MatEverythingModule],
  templateUrl: './demo-card.component.html',
  styleUrl: './demo-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubOpenSourceDemoCardComponent {

  _demoApp = input.required<DemoAppData>({alias: 'demoApp'});

  protected _name = computed(() => this._demoApp().name);
  protected _description = computed(() => this._demoApp().description);
  protected _icon = computed(() => this._demoApp().icon);
  protected _url = computed(() => this._demoApp().url);
  protected _img = computed(() => this._demoApp().image);

}
