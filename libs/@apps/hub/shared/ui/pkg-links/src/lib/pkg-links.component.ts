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

  _gitHubRepoUrl = input<string | undefined>('', { alias: 'gitHubRepoUrl' });
  _gitTooltip = input<string | undefined>('Git repo', { alias: 'gitTooltip' });
  _npmPackageUrl = input<string | undefined>('', { alias: 'npmPackageUrl' });
  _npmTooltip = input<string | undefined>('Npm Package', { alias: 'npmTooltip' });

  @HostBinding('style.--hoverColor')
  @Input('hoverColor') _hoverColor: string | undefined


} //Cls
