import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { SeoService } from '@spider-baby/utils-seo';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-custom-themes-api',
  templateUrl: './custom-themes-api.component.html',
  styleUrls: ['./custom-themes-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTabsModule,
    HighlightModule,
    RouterModule
  ]
})
export class CustomThemeApiComponent implements OnInit {

  private _seoService = inject(SeoService);
  private _router = inject(Router);
  
  //- - - - - - - - - - - - - - -//

  ngOnInit() {
    this._seoService.updateMetadata({
      title: 'Custom Theme Selector Component API',
      description: 'Documentation for the Custom Theme Selector Component including examples and usage.',
      url: this._router.url,
    });
  }

  //- - - - - - - - - - - - - - -//

  // Add examples and documentation content here
  // Examples for Theme Picker
  basicUsageExample = `
    <sb-theme-selector />
  `;
}