import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { HubAppConstants } from '@sb-hub/core-config/constants';
import { HubAppImages } from '@sb-hub/core-config/images';
import { MainPrincipalRoutes } from '@sb-hub/sections-main/config/route-data';
import { SbHubSharedUiFooterComponent } from '@sb-hub/shared-ui/footer';
import { HubHeroBanner2Component } from '@sb-hub/shared-ui/hero-banner/banner-2';
import { HubUiFancyNavCardComponent } from '@sb-hub/ui-cards/fancy-nav'; // Import the new card component
import { SbToastService, ToastData } from '@spider-baby/ui-toast';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';

//##############################################//

@Component({
  selector: 'hub-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    HighlightModule,
    HubHeroBanner2Component,
    SbHubSharedUiFooterComponent,
    HubUiFancyNavCardComponent // Add the new card component to imports
  ],
  providers: [
    // ToastService
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubMainHomeComponent implements OnInit {
  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _toast = inject(SbToastService);

  //- - - - - - - - - - - - - - -//

  // ...existing code...
  protected _title = 'Spider-Baby';
  protected _subtitle = 'A Journey Through Code, Content, and Open Source';
  protected _description = `Hi, I'm Spider-Baby. This space is dedicated to my passion for development and sharing knowledge. You'll find my blog articles, project showcases, and various open-source contributions. Feel free to look around and get inspired!`;
  // ...existing code...
  protected _heroImageUrl = HubAppImages.Logo.default;
  protected _heroImageAlt = 'Spider-Baby Logo';

  protected _features = signal(MainPrincipalRoutes);
  protected _gitUrl = signal(HubAppConstants.GIT_REP_URL);
  protected _npmUrl = signal(HubAppConstants.NPM_PACKAGES);

  protected _currentYear = new Date().getFullYear()

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata
    this._seoService.updateMetadata({
      title: this._title,
      description: this._description,
      url: this._router.url,
      keywords: ['Angular', 'Signals', 'Angular library', 'Reactive State'],
    });
  }

  static count = 0;


  showToast() {
    const errorToastData = ToastData.Create(
      'info',
      'This is an ERROR toast message! ' + HubMainHomeComponent.count++,
      {
        positionVertical: 'bottom',
      }
    )

    throw new Error('This is a simulated error to show the toast! ' + HubMainHomeComponent.count++);
    // this._toast.show(errorToastData, 6000);


  }
  showErrorToast() {
    const errorToastData = ToastData.Error('This is a Error toast message! ' + HubMainHomeComponent.count++)
      .positionBottomCenter()
      .withWobble()


    this._toast.show(errorToastData, 600000);
  }




  showSuccessToast() {
    const successToastData = ToastData.Success('This is a SUCCESS toast message! ' + HubMainHomeComponent.count++)
      .positionTopCenter()
      .withRubber()


    this._toast.show(successToastData, 2000);
  }

  showinfoToast() {
    const infoToastData = ToastData
      .Info('This is an INFO toast message!' + HubMainHomeComponent.count++,
        {
          dismissible: false,
          showIcon: true
        }
      )
      .positionCenter()
      .withSpin()

    this._toast.show(infoToastData, 5000);
  }



  showWarnToast() {
    const warnToastData = ToastData
      .Warning('This is a WARNING toast message! ' + HubMainHomeComponent.count++)
      .positionBottomRight()
      .withFade()
    this._toast.show(warnToastData, 600000);
  }



  clearAllToasts() {
    this._toast.clearAll()
  }



}
