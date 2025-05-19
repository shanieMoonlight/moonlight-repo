import { NgTemplateOutlet } from '@angular/common';
import { Component, input, TemplateRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';

@Component({
  selector: 'sb-hub-hero-banner-2', // Changed selector prefix if needed
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    NgTemplateOutlet
  ],
  templateUrl: './hero-banner-2.component.html',
  styleUrl: './hero-banner-2.component.scss',
})
export class HubHeroBanner2Component {

  _title = input<string>('Title', { alias: 'title' });
  _subtitle = input<string>('Subtitle', { alias: 'subtitle' });
  _description = input<string>('', { alias: 'description' });
  // _imageUrl = input<string | null>(null);
  // _imageAlt = input<string>('Hero Image');
  _actionsTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'actionsTemplate' });


}
