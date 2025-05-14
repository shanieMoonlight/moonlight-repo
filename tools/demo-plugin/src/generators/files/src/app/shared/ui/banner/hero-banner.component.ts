import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: '<%= prefix %>-hero-banner', 
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBannerComponent {

  _title = input.required<string>({ alias: 'title' });
  _subtitle = input.required<string>({ alias: 'subtitle' });
  _description = input<string | undefined>(undefined, { alias: 'description' });
  _imageUrl = input<string | undefined>(undefined, { alias: 'imageUrl' });
  _imageAlt = input<string | undefined>(undefined, { alias: 'imageAlt' });
  _actionsTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'actionsTemplate' });


}