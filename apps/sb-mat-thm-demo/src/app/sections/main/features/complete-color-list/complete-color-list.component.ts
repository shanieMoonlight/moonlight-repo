import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeVariablesShowcaseComponent } from '../../ui/color-vars-display/color-vars-display.component';

@Component({
  selector: 'ml-complete-color-list',
  imports: [ThemeVariablesShowcaseComponent],
  template: `<ml-theme-variables-showcase/>`,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CompleteColorListComponent {}
