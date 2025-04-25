import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { HomeSectionHdrComponent } from '../section-hdr/section-hdr.component';

@Component({
  selector: 'sb-home-sectioned-themes',
  imports: [
    MatEverythingModule,
    HomeSectionHdrComponent,
    ],
  template: `  
    <sb-home-section-hdr 
        [sectionNumber]="_sectionNumber()" 
        [title]="'Section-Based Theming'"/>
        
        <mat-card>
                    <mat-card-content>
                        <p>Create unique theme contexts for different sections of your application:</p>
                        <ul class="feature-list">
                            <li>
                                <mat-icon color="primary">account_tree</mat-icon>
                                <span><strong>Route-specific themes</strong> - Define different theme palettes for separate areas of your app</span>
                            </li>
                            <li>
                                <mat-icon color="primary">swap_horiz</mat-icon>
                                <span><strong>Context switching</strong> - Automatically change available themes when navigating between
                                    sections</span>
                            </li>
                            <li>
                                <mat-icon color="primary">settings_backup_restore</mat-icon>
                                <span><strong>Smart restoration</strong> - Previous theme context returns when leaving a themed section</span>
                            </li>
                        </ul>

                        <div class="component-demo centered">
                            <button mat-raised-button color="primary" routerLink="/seasons">
                                <mat-icon>palette</mat-icon>
                                Try Seasonal Themes Demo
                            </button>
                        </div>
                    </mat-card-content>
                </mat-card>

  `,
  styles: `
    @use '../@common/common.scss' as *;

    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionedThemesComponent {

  
  _sectionNumber = input.required({ alias: 'sectionNumber' });
  
}
