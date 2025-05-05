import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-apply-theme-api',
  templateUrl: './apply-theme-api.component.html',
  styleUrls: ['./apply-theme-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTabsModule,
    HighlightModule
  ]
})
export class ApplyThemeApiComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);

  ngOnInit() {
    this._seoService.updateMetadata({
      title: 'Apply Theme Directive API - SpiderBaby Material Theming',
      description: 'Documentation for the Apply Theme directive, including examples and usage.',
      url: this._router.url,
    });

    this._seoService.addCanonicalLinkRelative(this._router.url)
  }

  // Add examples and documentation content here

  // Examples for Apply Theme Directive
  basicUsageExample = `
  <div sbApplyTheme="material-light"></div>
  `;

  advancedUsageExample = `
  <div [sbApplyTheme]="themeObject"></div>

  // In your component class
  themeObject = {
    name: 'Custom Theme',
    primary: '#ff5722',
    accent: '#03a9f4',
    warn: '#e91e63'
  };
  `;

  /**
   * The Apply Theme directive accepts an input that can either be:
   * - A `theme-value` corresponding to a pre-configured theme.
   * - An entirely new theme object generated in the component.
   */
}