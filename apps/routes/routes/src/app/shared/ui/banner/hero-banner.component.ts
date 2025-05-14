// filepath: apps/mini-state/demo/src/app/sections/main/ui/hero-banner/hero-banner.component.ts
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';

@Component({
  selector: 'rd-hero-banner', // Changed selector prefix if needed
  standalone: true,
  imports: [
    MatEverythingModule,
    NgTemplateOutlet
  ],
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBannerComponent {
  // Input with aliases
  _title = input.required<string>({ alias: 'title' });
  _subtitle = input.required<string>({ alias: 'subtitle' });
  _description = input<string | undefined>(undefined, { alias: 'description' });
  _imageUrl = input<string | undefined>(undefined, { alias: 'imageUrl' });
  _imageAlt = input<string | undefined>(undefined, { alias: 'imageAlt' });
  _actionsTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'actionsTemplate' });

}