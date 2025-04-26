import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';

/**
 * UI i element for demoing the current theme.
 */
@Component({
  selector: 'sb-current-theme-banner',
  imports: [MatTooltipModule],
  template: `
    <div class="left" [matTooltip]="_withTooltips() ? 'Secondary Color (--mat-seed-secondary)' : ''"></div>
    <div class="middle" [matTooltip]="_withTooltips() ? 'Primary Color (--mat-seed-primary)' : ''"></div>
    <div class="right" [matTooltip]="_withTooltips() ? 'Tertiary Color (--mat-seed-tertiary)' : ''"></div>
  `,
  styles: `
    :host {
      width:  100%;
      height: 30px;
      display: flex;
        .left { 
          flex: 1;
          background-color: var(--mat-seed-secondary)
        }
        .middle { 
          flex: 2;
          background-color:var(--mat-seed-primary);
        }
        .right { 
          flex: 1;
          background-color:var(--mat-seed-tertiary, var(--mat-seed-secondary));
        }
        * {
          transition:
            color 1.4s cubic-bezier(0.4, 0, 0.2, 1),
            background-color 1.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MlCurrentThemeBannerComponent {

  _withTooltips = input(false, {alias: 'withTooltips'}) 

}
