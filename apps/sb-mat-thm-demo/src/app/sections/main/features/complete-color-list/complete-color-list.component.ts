import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeVariablesShowcaseComponent } from '../../ui/color-vars-display/color-vars-display.component';

@Component({
  selector: 'sb-complete-color-list',
  imports: [ThemeVariablesShowcaseComponent],
  template: `<sb-theme-variables-showcase/>`,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CompleteColorListComponent {}
