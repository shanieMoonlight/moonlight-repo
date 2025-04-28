import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { HighlightModule } from 'ngx-highlightjs';
import { Router } from '@angular/router';
import { SeoService } from '../../../../shared/services/seo.service';
import { UrlService } from '../../../../shared/utils/urls/url.service';

@Component({
  selector: 'sb-theme-picker-api',
  templateUrl: './theme-picker-api.component.html',
  styleUrls: ['./theme-picker-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTabsModule,
    HighlightModule
  ]
})
export class ThemePickerApiComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _urlService = inject(UrlService);

  ngOnInit() {
    this._seoService.updateMetadata({
      title: 'Theme Picker API - SpiderBaby Material Theming',
      description: 'Documentation for the Theme Picker component, including examples and usage.',
      url: this._urlService.combineWithBase(this._router.url),
    });

    this._seoService.addCanonicalLink(this._urlService.combineWithBase(this._router.url));
  }

  // Add examples and documentation content here
  // Examples for Theme Picker
  basicUsageExample = `
  <sb-theme-picker-mat></sb-theme-picker-mat>
  `;

  advancedUsageExample = `
  <sb-theme-picker-mat [pickerTooltip]="'Select a theme'" [includeCustomThemes]="false" (theme)="onThemeChange($event)"></sb-theme-picker-mat>

  onThemeChange(theme: ThemeOption | undefined) {
    console.log('Selected theme:', theme);
  }
  `;
}