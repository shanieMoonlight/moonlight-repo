import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';
import { MyIdCardComponent } from '../../../../shared/ui/card/card.component';
import { MAIN_ROUTES } from '../../config/route-data';


@Component({
  selector: 'sb-home',
  standalone: true,
  imports: [
    RouterModule,
    MyIdCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);

  //- - - - - - - - - - - - - - -//

  protected _title = 'myid-demo ';
  protected _subtitle = 'Concise description of what this application does';
  protected _description = `This is a more detailed description of your application's purpose and main features. 
  You can elaborate on key functionality, target users, or any other important information
  that helps explain what makes your application valuable.`;
  protected _heroImageUrl = AppImages.Logo.default
  protected _heroImageAlt = 'myid-demo Logo';

  protected _features = signal(MAIN_ROUTES);
  protected _gitUrl = signal(AppConstants.GIT_REP_URL);

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Signals', 'Identity', 'MyId', 'Demo'],
    });
  }
}

