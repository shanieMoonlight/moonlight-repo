import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'ml-theme-variables-showcase',
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionModule,
        MatCardModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        ClipboardModule
    ],
    template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Material Design 3 Theme Variables</mat-card-title>
        <mat-card-subtitle>All available CSS variables from Moonlight Theming</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <mat-accordion multi>
          <!-- Main system variables section -->
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>System Variables</mat-panel-title>
              <mat-panel-description>M3 design system variables</mat-panel-description>
            </mat-expansion-panel-header>
            
            <div class="variable-group">
              <h3>Primary Colors</h3>
              <ul class="variable-list">
                @for (variable of primaryColors; track $index) {
                  <li class="variable-item">
                    <code>{{ variable }}</code>
                    <button 
                      mat-icon-button 
                      [cdkCopyToClipboard]="variable"
                      matTooltip="Copy to clipboard">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </li>
                }
              </ul>
            </div>

            <div class="variable-group">
              <h3>Secondary Colors</h3>
              <ul class="variable-list">
                @for (variable of secondaryColors; track $index) {
                  <li class="variable-item">
                    <code>{{ variable }}</code>
                    <button 
                      mat-icon-button 
                      [cdkCopyToClipboard]="variable"
                      matTooltip="Copy to clipboard">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </li>
                }
              </ul>
            </div>

            <!-- Continue with other variable groups -->
            <!-- ... -->
          </mat-expansion-panel>

          <!-- Palette tone variables sections -->
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>Primary Palette Tones</mat-panel-title>
              <mat-panel-description>All primary color tones (0-100)</mat-panel-description>
            </mat-expansion-panel-header>
            
            <ul class="variable-list tone-list">
              @for (tone of tones; track $index) {
                <li class="variable-item">
                  <code>--ml-color-primary-{{ tone }}</code>
                  <button 
                    mat-icon-button 
                    [cdkCopyToClipboard]="'--ml-color-primary-' + tone"
                    matTooltip="Copy to clipboard">
                    <mat-icon>content_copy</mat-icon>
                  </button>
                </li>
              }
            </ul>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>Secondary Palette Tones</mat-panel-title>
              <mat-panel-description>All secondary color tones (0-100)</mat-panel-description>
            </mat-expansion-panel-header>
            
            <ul class="variable-list tone-list">
              @for (tone of tones; track $index ) {
                <li class="variable-item">
                  <code>--ml-color-secondary-{{ tone }}</code>
                  <button 
                    mat-icon-button 
                    [cdkCopyToClipboard]="'--ml-color-secondary-' + tone"
                    matTooltip="Copy to clipboard">
                    <mat-icon>content_copy</mat-icon>
                  </button>
                </li>
              }
            </ul>
          </mat-expansion-panel>

          <!-- Add similar panels for tertiary, error, neutral, neutralVariant -->

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>Usage Examples</mat-panel-title>
              <mat-panel-description>How to use these variables in your CSS</mat-panel-description>
            </mat-expansion-panel-header>
            
            <pre><code>
.my-custom-element &#123;
  // Use primary color with 70% opacity  
  background-color: rgba(var(--mat-sys-primary-rgb), 0.7);
  

  // Use on-surface color for text
  color: var(--mat-sys-on-surface);
  

  // Use error container for highlights
  border: 2px solid var(--mat-sys-error-container);
&#125;
            </code></pre>
          </mat-expansion-panel>
        </mat-accordion>
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
.variable-list {
  list-style-type: none;
  padding-left: 0.5rem;
  display: grid;
  /* Increase minimum width to account for icon + text */
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 0.5rem;
}

.tone-list {
  /* Tone names are shorter, so we can use less width */
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.variable-item {
  display: flex;
  align-items: center;
  /* Use flex-start instead of space-between for better narrowing behavior */
  justify-content: flex-start;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: var(--mat-sys-surface-container-low);
  overflow: hidden;
  min-width: 0;
}

/* Fixed width for the button container */
.variable-item button {
  flex: 0 0 36px; /* Fixed width: icon (24px) + some padding */
  margin-left: 8px;
}

code {
  white-space: pre-wrap;
  font-family: 'Roboto Mono', monospace;
  color: var(--mat-sys-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1 1 auto;
  min-width: 0;
  /* Add max-width to ensure room for icon */
  max-width: calc(100% - 44px); /* 36px button + 8px margin */
}
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeVariablesShowcaseComponent {
    // System variables
    primaryColors = [
        '--mat-sys-primary',
        '--mat-sys-on-primary',
        '--mat-sys-primary-container',
        '--mat-sys-on-primary-container',
        '--mat-sys-primary-fixed',
        '--mat-sys-primary-fixed-dim',
        '--mat-sys-on-primary-fixed',
        '--mat-sys-on-primary-fixed-variant',
        '--mat-sys-inverse-primary'
    ];

    secondaryColors = [
        '--mat-sys-secondary',
        '--mat-sys-on-secondary',
        '--mat-sys-secondary-container',
        '--mat-sys-on-secondary-container',
        '--mat-sys-secondary-fixed',
        '--mat-sys-secondary-fixed-dim',
        '--mat-sys-on-secondary-fixed',
        '--mat-sys-on-secondary-fixed-variant'
    ];

    // ... define similar arrays for other variable groups

    // Generate all tone values
    tones = Array.from({ length: 11 }, (_, i) => i * 10)
        .concat([1, 2, 4, 6, 12, 17, 22, 24, 87, 92, 94, 95, 96, 98, 99, 100])
        .sort((a, b) => a - b);
}