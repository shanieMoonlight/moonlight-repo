import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { RouterModule } from '@angular/router';

@Component({
  selector: '<%= prefix %>-hero-banner', 
  standalone: true,
  imports: [
    MatEverythingModule, 
    RouterModule,
    NgTemplateOutlet],
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