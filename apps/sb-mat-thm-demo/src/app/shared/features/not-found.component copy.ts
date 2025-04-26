import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sb-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't seem to exist.</p>
      <p>It might have been moved, deleted, or maybe you mistyped the URL.</p>
      <button mat-flat-button color="primary" routerLink="/">
        <mat-icon>home</mat-icon>
        Go Back Home
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px); /* Adjust 64px based on your header height */
      text-align: center;
      padding: 24px;
      background-color: var(--mat-sys-surface); /* Use theme surface color */
      color: var(--mat-sys-on-surface); /* Use theme text color */
    }

    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px; /* Space between elements */
    }

    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: var(--mat-sys-error); /* Use theme error color */
      margin-bottom: 16px;
    }

    h1 {
      font-size: 2.5em;
      font-weight: 300;
      color: var(--mat-sys-primary); /* Use theme primary color */
      margin: 0;
    }

    p {
      font-size: 1.1em;
      color: var(--mat-sys-on-surface-variant); /* Use theme secondary text color */
      max-width: 500px;
      line-height: 1.6;
      margin: 0;
    }

    button {
      margin-top: 24px; /* Space above the button */
    }

    button mat-icon {
        margin-right: 8px;
    }
  `]
})
export class NotFoundComponent {}