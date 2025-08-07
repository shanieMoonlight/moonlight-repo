import { ChangeDetectionStrategy, Component, HostBinding, Input, input } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SbNavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';

@Component({
  standalone: true,
  imports: [
    MatEverythingModule,
    SbNavigateNewWindowDirective
  ],
  providers: [],
  selector: 'sb-hub-pkg-links',
  templateUrl: './pkg-links.component.html',
  styleUrl: './pkg-links.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbHubPkgLinksComponent {

  gitHubRepoUrl = input<string | undefined>(undefined);
  gitTooltip = input('Git repo');
  npmPackageUrl = input<string | undefined>(undefined);
  npmTooltip = input('Npm Package');
  demoWebsiteUrl = input<string | undefined>(undefined);
  demoTooltip = input('Demo Website');

  @HostBinding('style.--hoverColor')
  @Input() hoverColor?: string;

  
} //Cls
