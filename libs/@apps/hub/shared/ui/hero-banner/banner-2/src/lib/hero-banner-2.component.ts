import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, TemplateRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { HubAppImages, HubAppSvgs } from '@sb-hub/core-config/images';
import { DomSanitizer } from '@angular/platform-browser';
import { ObjectFit, ProgImgLoaderFunctions, SbProgressiveImageComponent } from '@spider-baby/utils-img/progressive';

//##########################################################//

const defaultSmallToLargeImgFn = ProgImgLoaderFunctions.replaceSegment('placeholder', 'xlarge')

//##########################################################//

@Component({
  selector: 'sb-hub-hero-banner-2', // Changed selector prefix if needed
  standalone: true,
  imports: [
    MatEverythingModule,
    RouterModule,
    SbProgressiveImageComponent,
    NgTemplateOutlet
  ],
  templateUrl: './hero-banner-2.component.html',
  styleUrl: './hero-banner-2.component.scss',
  host:{
    '[style.--canvas-opacity]': 'canvasOpacity()'
  }
})
export class HubHeroBanner2Component {

  private sanitizer = inject(DomSanitizer)
  private router = inject(Router);

  //- - - - - - - - - - - - - - //

  title = input<string>('');
  subtitle = input<string>('');
  description = input<string>('');
  // _imageUrl = input<string | null>(null);
  // _imageAlt = input<string>('Hero Image');
  actionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  canvasOpacity = input<number>(0.5);

  /**
   * Optional. The URL for the initial small/placeholder background image.
   * If provided, this image will be displayed initially, and then the `_smlToLrgFn`
   * will be used to transform this URL into the full-sized large image URL for progressive loading.
   * If not provided, no background image will be attempted.
   */
  backgroundImage = input<string | undefined>(undefined);

  /**
   * A function that converts a small image URL to a large image URL.
   * This property allows for progressive image loading by providing a smaller placeholder image initially
   * and using this function to replace it with a larger, higher quality image after loading.
   * 
   * @param smlImgUrl - The URL of the small/placeholder image
   * @returns The URL of the corresponding large/high-quality image
   * @default defaultSmallToLargeImgFn - A default function that replaces small image URLs with large ones (ProgImgLoaderFunctions.replaceSegment('placeholder', 'xlarge'))
   */
  smlToLrgFn = input<((smlImgUrl: string) => string) | undefined>(defaultSmallToLargeImgFn);


  objectFit = input<ObjectFit | undefined>('cover');
  objectPosition = input<string | undefined>(undefined);


  rawSvgString = HubAppSvgs.WEB;
  // Create a data URI from the SVG string
  svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(this.rawSvgString)}`;
  // Sanitize the URL to prevent XSS vulnerabilities
  _webSvg = this.sanitizer.bypassSecurityTrustUrl(this.svgDataUri);

  _spiderWeb = HubAppImages.Svgs.spiderWeb
  _spiderWeb2 = HubAppImages.Svgs.spiderWebWonky
  _spiderWeb3 = HubAppImages.Svgs.spiderWebWonky2

  // _logo = HubAppImages.Logo.medium
  _logo = HubAppImages.LogoAlternates.Logo2.small


  _transitionId = computed(() => this.router.url);


}
