import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { HomeSectionHdrComponent } from '../section-hdr/section-hdr.component';
import { SbNavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { AppConstants } from '../../../../../../config/constants';

@Component({
  selector: 'sb-home-git',
  imports: [
    MatEverythingModule,
    HomeSectionHdrComponent,
    SbNavigateNewWindowDirective
    ],
  template: `
    <sb-home-section-hdr 
        [sectionNumber]="_sectionNumber()" 
        [title]="'Github'"/>
     <!-- <h3>Source Code</h3> -->
                <p>
                  The source code for this library is available on GitHub. Feel free to:
                </p>
                <ul class="feature-list">
                  <li>
                    <mat-icon color="primary">star</mat-icon>
                    <span>Star the repository to show your support</span>
                  </li>
                  <li>
                    <mat-icon color="primary">bug_report</mat-icon>
                    <span>Report issues or bugs you encounter</span>
                  </li>
                  <li>
                    <mat-icon color="primary">fork_right</mat-icon>
                    <span>Fork the repository to create your own version</span>
                  </li>
                  <li>
                    <mat-icon color="primary">diversity_3</mat-icon>
                    <span>Contribute to the project with pull requests</span>
                  </li>
                </ul>
                <a mat-raised-button color="primary" [sbNavigateNewWindow]="_gitRepoUrl()">
                  <mat-icon svgIcon="git"></mat-icon>
                  View on GitHub
                </a>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GitComponent {

  
  _sectionNumber = input.required({ alias: 'sectionNumber' });

  
  protected _gitRepoUrl = signal(AppConstants.GIT_REPO)
  
}
