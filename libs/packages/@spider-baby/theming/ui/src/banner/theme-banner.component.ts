import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ThemeOption } from '@spider-baby/material-theming/config';

/**
 * UI i element for demoing a specific theme.
 */
@Component({
  selector: 'sb-theme-banner',
  imports: [MatTooltipModule],
  template: `
    <div class="left" [style.backgroundColor]="_primary()"></div>
    <div class="middle" [style.backgroundColor]="_secondary()"></div>
    <div class="right" [style.backgroundColor]="_tertiary()"></div>
  `,
  styles: `
    :host {
      width:  100%;
      height: 30px;
      display: flex;
        .left { 
          flex: 1;
        }
        .middle { 
          flex: 2;
        }
        .right { 
          flex: 1;
        }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbThemeBannerComponent {

  _theme = input.required<ThemeOption>( {alias: 'theme'})


  _primary =computed(() => this._theme().primaryColor)
  _secondary =computed(() => this._theme().secondaryColor)
  _tertiary =computed(() => this._theme().tertiaryColor)

}//Cls
