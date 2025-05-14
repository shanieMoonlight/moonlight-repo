import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { HeroBannerComponent } from '../../../../shared/ui/banner/hero-banner.component';
import { AppImages3 } from '../../../../config/images';

@Component({
  selector: 'rd-content',
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    HeroBannerComponent
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent {

  protected _title = 'Content';
  protected _subtitle = 'Manage application content';
  protected _description = `This section allows you to manage website or application content efficiently.`;
  protected _heroImageUrl = AppImages3.Logo.small
  protected _heroImageAlt = 'Content Management';

}
