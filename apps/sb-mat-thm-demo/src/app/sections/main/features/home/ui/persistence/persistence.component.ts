import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { HomeSectionHdrComponent } from '../section-hdr/section-hdr.component';

@Component({
  selector: 'sb-home-persistence',
  imports: [
    MatEverythingModule,
    HomeSectionHdrComponent
  ],
  template: `  
  <sb-home-section-hdr 
      [sectionNumber]="_sectionNumber()" 
      [title]="'Persistent Preferences'"/>
    <mat-card>
        <mat-card-content>
            <p>User preferences are automatically saved between sessions:</p>
            <ul class="feature-list">
                <li>
                    <mat-icon color="primary">save</mat-icon>
                    <span><strong>Theme selection</strong> - Users' chosen theme is remembered</span>
                </li>
                <li>
                    <mat-icon color="primary">brightness_4</mat-icon>
                    <span><strong>Dark mode preference</strong> - Light/dark mode setting persists</span>
                </li>
                <li>
                    <mat-icon color="primary">brush</mat-icon>
                    <span><strong>Custom themes</strong> - User-created themes are stored</span>
                </li>
                <li>
                    <mat-icon color="primary">settings</mat-icon>
                    <span><strong>Configurable storage</strong> - Uses localStorage by default with options for custom storage
                        strategies</span>
                </li>
            </ul>
        </mat-card-content>
    </mat-card>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersistenceComponent {

  
  _sectionNumber = input.required({ alias: 'sectionNumber' });

}
