import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { SeoService, UrlUtilsService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-dark-mode-toggle-api',
  templateUrl: './dark-mode-toggle-api.component.html',
  styleUrls: ['./dark-mode-toggle-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTabsModule,
    HighlightModule
  ]
})
export class DarkModeToggleApiComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);
  private _urlService = inject(UrlUtilsService);

  ngOnInit() {
    this._seoService.updateMetadata({
      title: 'Dark Mode Toggle API - SpiderBaby Material Theming',
      description: 'Documentation for the Dark Mode Toggle component, including examples and usage.',
      url: this._urlService.combineWithBase(this._router.url),
    });

    this._seoService.addCanonicalLinkRelative(this._router.url)
  }

  // Add examples and documentation content here
  // Examples for Dark Mode Toggle
  basicUsageExample = `
  <sb-dark-mode-toggle-mat></sb-dark-mode-toggle-mat>
  `;

  advancedUsageExample = `
  <sb-dark-mode-toggle-mat [showTooltip]="true" (toggle)="onToggleDarkMode($event)"></sb-dark-mode-toggle-mat>

  onToggleDarkMode(isDarkMode: boolean) {
    console.log('Dark mode is now:', isDarkMode ? 'enabled' : 'disabled');
  }
  `;
}