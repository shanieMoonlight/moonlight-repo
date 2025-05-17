import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sb-hub-spider-baby-hub-entry-point',
  imports: [CommonModule],
  templateUrl: './spider-baby-hub-entry-point.component.html',
  styleUrl: './spider-baby-hub-entry-point.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpiderBabyHubEntryPointComponent {}
