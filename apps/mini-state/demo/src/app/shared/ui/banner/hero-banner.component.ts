// filepath: apps/mini-state/demo/src/app/sections/main/ui/hero-banner/hero-banner.component.ts
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sb-hero-banner', // Changed selector prefix if needed
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="hero-banner">
      <div class="banner-content">
        @if (imageUrl()) {
          <img class="hero-image" [src]="imageUrl()" [alt]="imageAlt()" />
        }
        <h1 class="title">{{ title() }}</h1>
        <h2 class="subtitle">{{ subtitle() }}</h2>
        <p class="description">{{ description() }}</p>

        <div class="cta-buttons">
          <a mat-raised-button color="primary" [routerLink]="primaryButtonLink()">
            <mat-icon>{{ primaryButtonIcon() }}</mat-icon> {{ primaryButtonText() }}
          </a>
          <a mat-stroked-button color="accent" [href]="secondaryButtonLink()" target="_blank">
            <mat-icon>{{ secondaryButtonIcon() }}</mat-icon> {{ secondaryButtonText() }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
    .hero-banner {
      position: relative;
      min-height: 300px; /* Adjust as needed */
      padding: 48px 24px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 32px;
      background: linear-gradient(135deg, var(--mat-sys-primary-container) 45%, var(--mat-sys-secondary-container) 100%);
      color: var(--mat-sys-on-primary-container); /* Adjust text color based on container */
      box-shadow: 0 6px 25px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .banner-content {
      max-width: 800px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-image {
      max-height: 120px; /* Adjust size */
      margin-bottom: 24px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }

    .title {
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: 8px;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 1.8rem;
      font-weight: 300;
      opacity: 0.9;
      margin-bottom: 16px;
    }

    .description {
      font-size: 1.1rem;
      opacity: 0.8;
      margin-bottom: 24px;
      max-width: 600px;
    }

    .cta-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
      justify-content: center;

      a {
        text-decoration: none;
      }

      mat-icon {
        margin-right: 8px;
      }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .title {
        font-size: 2.8rem;
      }
      .subtitle {
        font-size: 1.5rem;
      }
      .hero-banner {
        padding: 32px 16px;
      }
    }
     @media (max-width: 480px) {
      .title {
        font-size: 2.2rem;
      }
      .subtitle {
        font-size: 1.3rem;
      }
      .cta-buttons {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        max-width: 300px; /* Limit button width */
      }
    }
  `
})
export class HeroBannerComponent {

  title = input<string>('Title');
  subtitle = input<string>('Subtitle');
  description = input<string>('');
  imageUrl = input<string | null>(null);
  imageAlt = input<string>('Hero Image');

  primaryButtonText = input<string>('Primary Action');
  primaryButtonLink = input<string>('/');
  primaryButtonIcon = input<string>('play_arrow');

  secondaryButtonText = input<string>('Secondary Action');
  secondaryButtonLink = input<string>('#');
  secondaryButtonIcon = input<string>('code');

}