import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AppImages1 } from '../../config/images';

@Component({
  selector: 'rd-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <img class="spider-baby-logo" [src]="_logo()" alt="Spider Baby" />
      <h1>Oops! Page Not Found</h1>
      <p class="playful-text">
        Looks like our little spider got lost in the web! 🕸️
      </p>
      <p>
        This page seems to have scurried away or never existed in the first
        place.
      </p>
      <button mat-flat-button color="primary" routerLink="/">
        <mat-icon>home</mat-icon>
        Spin Back Home
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 64px);
        text-align: center;
        padding: 24px;
        background-color: var(--mat-sys-surface);
        color: var(--mat-sys-on-surface);
        position: relative;
        overflow: hidden;
      }

      .not-found-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        position: relative;
        z-index: 2;
      }

      .spider-baby-logo {
        width: 300px;
        height: auto;
        margin-bottom: 8px;
        animation: dance 3s infinite alternate ease-in-out;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      }

      @keyframes dance {
        0% {
          transform: translateY(0) rotate(-5deg);
        }
        50% {
          transform: translateY(-15px) rotate(5deg);
        }
        100% {
          transform: translateY(0) rotate(-5deg);
        }
      }

      h1 {
        font-size: 2.8em;
        font-weight: 300;
        color: var(--mat-sys-primary);
        margin: 0;
        animation: colorShift 8s infinite alternate;
      }

      @keyframes colorShift {
        0% {
          color: var(--mat-sys-primary);
        }
        33% {
          color: var(--mat-sys-secondary);
        }
        66% {
          color: var(--mat-sys-tertiary);
        }
        100% {
          color: var(--mat-sys-primary);
        }
      }

      .playful-text {
        font-size: 1.3em;
        font-weight: 500;
        letter-spacing: 0.5px;
      }

      p {
        font-size: 1.1em;
        color: var(--mat-sys-on-surface-variant);
        max-width: 500px;
        line-height: 1.6;
        margin: 0;
      }

      button {
        margin-top: 28px;
        transition: transform 0.3s ease;
        animation: pulse 2s infinite;
      }

      button:hover {
        transform: scale(1.05);
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      button mat-icon {
        margin-right: 8px;
      }

      /* Add some decorative elements */
      :host::before {
        content: '';
        position: absolute;
        top: 20%;
        left: 15%;
        width: 10px;
        height: 10px;
        background: var(--mat-sys-primary);
        opacity: 0.1;
        border-radius: 50%;
        box-shadow: 0 0 40px 20px var(--mat-sys-primary);
        animation: float 15s infinite ease-in-out;
      }

      :host::after {
        content: '';
        position: absolute;
        bottom: 20%;
        right: 15%;
        width: 15px;
        height: 15px;
        background: var(--mat-sys-secondary);
        opacity: 0.5;
        border-radius: 50%;
        box-shadow: 0 0 50px 25px var(--mat-sys-secondary);
        animation: float 20s infinite ease-in-out reverse;
      }

      @keyframes float {
        0%,
        100% {
          transform: translate(0, 0);
        }
        25% {
          transform: translate(50px, 50px);
        }
        50% {
          transform: translate(0, 100px);
        }
        75% {
          transform: translate(-50px, 50px);
        }
      }
    `,
  ],
})
export class NotFoundComponent {
  _logo = signal(AppImages1.Logo.medium);
}
