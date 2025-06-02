import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-hangfire-isolation',
  imports: [HighlightModule, MatEverythingModule],
  templateUrl: './hangfire-isolation.component.html',
  styleUrl: './hangfire-isolation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HangfireIsolationComponent {}
