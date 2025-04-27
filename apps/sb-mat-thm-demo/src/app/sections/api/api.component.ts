import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { StructuredDataService } from '../../shared/services/structured-data.service';
import { SeoService } from '../../shared/services/seo.service';
import { ApiNavbarComponent } from './ui/navbar/navbar.component';
import { MlDarkModeToggleMatComponent, MlThemePickerMatComponent } from "@spider-baby/material-theming/components";
import { AppConstants } from '../../config/constants';


@Component({
  selector: 'sb-api',
  standalone: true,
  imports: [
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    RouterOutlet,
    ApiNavbarComponent,
    MlDarkModeToggleMatComponent,
    MlThemePickerMatComponent
],
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    private structuredDataService: StructuredDataService,
    private router: Router
  ) {}

  ngOnInit() {
    // Set SEO metadata
    this.seoService.updateMetadata({
      title: 'API Documentation - SpiderBaby Material Theming',
      description: 'Complete API reference and documentation for the SpiderBaby Material Theming library, including theme service API and CSS variables list.',
      url: AppConstants.DEMO_URL + this.router.url,
    });

    // Add canonical link
    this.seoService.addCanonicalLink(AppConstants.DEMO_URL + this.router.url);

    // Add structured data
    this.structuredDataService.addLibraryStructuredData();
  }
}
