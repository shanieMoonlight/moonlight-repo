import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ThemeTransitionService } from '@spider-baby/material-theming/service';

@Component({
  selector: 'sb-theme-transition-indicator',
  standalone: true,
  imports: [MatProgressBarModule],
  template: `
    @if (transitionService.isTransitioning()) {
      <div class="transition-indicator">
        <mat-progress-bar mode="indeterminate" color="accent"/>
      </div>
    }
  `,
  styles: `
    .transition-indicator {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10000;
    }
  `
})
export class ThemeTransitionIndicatorComponent {
  transitionService = inject(ThemeTransitionService);
}