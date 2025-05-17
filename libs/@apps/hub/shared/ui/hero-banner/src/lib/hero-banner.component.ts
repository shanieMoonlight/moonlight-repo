import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';

@Component({
  selector: 'sb-hub-hero-banner', // Changed selector prefix if needed
  standalone: true,
  imports: [MatEverythingModule, RouterModule],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HubHeroBannerComponent {
  title = input<string>('Title');
  subtitle = input<string>('Subtitle');
  description = input<string>('');
  imageUrl = input<string | null>(null);
  imageAlt = input<string>('Hero Image');

  primaryButtonText = input<string>('Primary Action');
  primaryButtonLink = input<string>('/');
  primaryButtonIcon = input<string>('play_arrow');

  secondaryButtonText = input<string>('Secondary Action');
  secondaryButtonLink = input<string>('#');
  secondaryButtonIcon = input<string>('code');
}
