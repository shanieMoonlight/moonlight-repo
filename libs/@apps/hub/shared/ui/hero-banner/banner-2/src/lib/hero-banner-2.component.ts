import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, TemplateRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { HubAppImages, HubAppSvgs } from '@sb-hub/core-config/images';
import { DomSanitizer } from '@angular/platform-browser';

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

  private sanitizer= inject (DomSanitizer)

  _title = input<string>('', { alias: 'title' });
  _subtitle = input<string>('', { alias: 'subtitle' });
  _description = input<string>('', { alias: 'description' });
  // _imageUrl = input<string | null>(null);
  // _imageAlt = input<string>('Hero Image');
  _actionsTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'actionsTemplate' });
  _bgImg = input<string | null, string | undefined>(null, { // Changed type to string | null for the signal
    alias: 'backgroundImage',
    transform: (value: string | undefined): string | null => {
      return value ? `url(${value})` : null;
    }
  });

  // _webSvg = HubAppSvgs.WEB


     rawSvgString = HubAppSvgs.WEB;
    // Create a data URI from the SVG string
     svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(this.rawSvgString)}`;
    // Sanitize the URL to prevent XSS vulnerabilities
    _webSvg = this.sanitizer.bypassSecurityTrustUrl(this.svgDataUri);

    _spiderWeb = HubAppImages.Svgs.spiderWeb
    _spiderWeb2 = HubAppImages.Svgs.spiderWebWonky
    _spiderWeb3 = HubAppImages.Svgs.spiderWebWonky2

}
