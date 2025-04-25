import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { DEFAULT_COLOR_TONES } from '@spider-baby/material-theming/config';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { HomeSectionHdrComponent } from '../section-hdr/section-hdr.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sb-home-color-vars',
  imports: [
    MatEverythingModule,
    HomeSectionHdrComponent,
    RouterModule
  ],
  templateUrl: './color-vars.component.html',
  styleUrl: './color-vars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HomeColorVarsComponent {

  
  _sectionNumber = input.required({ alias: 'sectionNumber' });

  protected _tones = signal(DEFAULT_COLOR_TONES)

}
