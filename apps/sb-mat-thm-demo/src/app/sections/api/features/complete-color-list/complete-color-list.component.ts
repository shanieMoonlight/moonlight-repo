import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService, UrlUtilsService } from '@spider-baby/utils-seo';
import { ThemeVariablesShowcaseComponent } from './ui/color-vars-display/color-vars-display.component';

@Component({
  selector: 'sb-api-complete-color-list',
  template: `<sb-theme-variables-showcase/>`,
  styles: `
    :host {
      display: block;
    }
  `,
  imports: [ThemeVariablesShowcaseComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CompleteColorListComponent implements OnInit {

  private _seoService = inject(SeoService)
  private _router = inject(Router)
  private _urlService = inject(UrlUtilsService)

  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    // Set SEO metadata specific to the CSS Variables List page
    this._seoService.updateMetadata({
      title: 'CSS Variables List - SpiderBaby Material Theming',
      description: 'Complete reference of all CSS variables available in SpiderBaby Material Theming. Use these variables to customize your Angular Material components with ease.',
      url: this._urlService.combineWithBase(this._router.url),
    });

    // Add canonical link
    this._seoService.addCanonicalLink(this._urlService.combineWithBase(this._router.url));
  }
}
