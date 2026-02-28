import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppImages } from '../../config/images/images';
import { RouterLink } from '@angular/router';

//######################################//

const DEFAULT_LOGO = AppImages.Logo.Small;

//######################################//

@Component({
  selector: 'scratch-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrls: ['./nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScratchPadNavbar {

  /** Path to logo image */
  logo = input<string>(DEFAULT_LOGO);

  /** Center title */
  title = input<string>('Scratch Pad');
}
