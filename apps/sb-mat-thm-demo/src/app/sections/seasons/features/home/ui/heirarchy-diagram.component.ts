import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { THEME_CONFIG } from '../../../../../config/app-theme.config';
import { SEASON_THEME_CONFIG } from '../../../config/seasonal-theme.config';

@Component({
  selector: 'sb-theme-hierarchy-diagram',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="diagram-container">
      <h3>Hierarchical Theme Architecture</h3>
      
      <div class="diagram-controls">
        <button mat-button (click)="showAnimation()" color="primary">
          <mat-icon>play_arrow</mat-icon> Show Navigation Effects
        </button>
        <span class="hint">Hover over sections to see details</span>
      </div>
      
      <div class="diagram-wrapper" [class.animating]="isAnimating">
        <!-- Root App Box -->
        <div 
          class="diagram-box root-box" 
          [class.highlight]="highlightedSection === 'root'"
          (mouseenter)="highlightedSection = 'root'"
          (mouseleave)="highlightedSection = null"
          matTooltip="Root level where Material themes are defined">
          <div class="box-title">Root App</div>
          <div class="box-subtitle">Base Angular Material Styles</div>

          <div class="themes-container material-themes" [class.active]="currentStep === 0 || currentStep === 2">
            <div class="theme-section-title">Root Themes Defined Here</div>
            @for (theme of _baseThemes(); track $index) {
              <div class="theme-item" [style.color]="theme.primaryColor">- {{theme.label}}</div>
            }
          </div>
        </div>
        
        <div class="connector-line"></div>
        <div class="connector-split"></div>
        
        <!-- Main Section Box -->
        <div class="section-row">
          <div 
            class="diagram-box section-box main-box" 
            [class.highlight]="highlightedSection === 'main'"
            [class.active-section]="currentStep === 0"
            (mouseenter)="highlightedSection = 'main'"
            (mouseleave)="highlightedSection = null"
            matTooltip="Main section inherits root themes">
            <div class="box-title">Main Section</div>
            <div class="themes-container">
              <div class="theme-section-title">Inherits Material Themes from Root</div>
              <div class="empty-placeholder"></div>
            </div>
            <div class="box-footer">ThemePickerComponent (Shows Material themes)</div>
          </div>
          
          <!-- Seasons Section Box -->
          <div 
            class="diagram-box section-box seasons-box" 
            [class.highlight]="highlightedSection === 'seasons'"
            [class.active-section]="currentStep === 1"
            (mouseenter)="highlightedSection = 'seasons'"
            (mouseleave)="highlightedSection = null"
            matTooltip="Seasons section replaces themes with its own set">
            <div class="box-title">Seasons Section</div>
            <div class="themes-container seasonal-themes" [class.active]="currentStep === 1">
              <div class="theme-section-title">Replaces with Seasonal Themes:</div>
               @for (theme of _seasonalThemes(); track $index) {
                <div class="theme-item" [style.color]="theme.primaryColor">- {{theme.label}}</div>
              }
            </div>
            <div class="box-footer">ThemePickerComponent (Shows Season themes)</div>
          </div>
        </div>
      </div>
      
      <div class="animation-caption" *ngIf="isAnimating">
        <strong>Step {{ currentStep + 1 }}/3:</strong> {{ animationSteps[currentStep] }}
      </div>
    </div>
  `,
  styles: [`
    .diagram-container {
      margin: 2rem 0;
      background-color: var(--mat-sys-surface-container);
      border-radius: 8px;
      padding: 1.5rem;
      position: relative;
    }
    
    .diagram-controls {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      justify-content: space-between;
    }
    
    .hint {
      font-size: 0.85rem;
      color: var(--mat-sys-on-surface-variant);
      font-style: italic;
    }
    
    .diagram-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding: 1rem 0;
      transition: all 0.5s ease;
    }
    
    .diagram-box {
      border: 2px solid var(--mat-sys-outline);
      border-radius: 8px;
      padding: 1rem;
      margin: 0.5rem;
      transition: all 0.3s ease;
      background-color: var(--mat-sys-surface-container-high);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
    }
    
    .root-box {
      width: 90%;
      max-width: 600px;
      z-index: 2;
    }
    
    .section-row {
      display: flex;
      width: 100%;
      justify-content: space-around;
      flex-wrap: wrap;
      z-index: 1;
    }
    
    .section-box {
      width: 45%;
      min-width: 250px;
      display: flex;
      flex-direction: column;
      min-height: 220px;
    }
    
    .main-box {
      border-color: var(--mat-sys-primary);
    }
    
    .seasons-box {
      border-color: var(--mat-sys-primary-60, #f57c00);
    }
    
    .box-title {
      font-weight: bold;
      font-size: 1.1rem;
      text-align: center;
      margin-bottom: 0.5rem;
      color: var(--mat-sys-on-surface);
    }
    
    .box-subtitle {
      font-size: 0.9rem;
      text-align: center;
      margin-bottom: 1rem;
      color: var(--mat-sys-on-surface-variant);
    }
    
    .box-footer {
      margin-top: auto;
      padding-top: 1rem;
      font-size: 0.85rem;
      text-align: center;
      border-top: 1px dashed var(--mat-sys-outline-variant);
      color: var(--mat-sys-on-surface-variant);
    }
    
    .themes-container {
      padding: 0.75rem;
      border-radius: 4px;
      background-color: var(--mat-sys-surface-container-low);
      transition: all 0.5s ease;
      opacity: 0.8;
    }
    
    .themes-container.active {
      transform: scale(1.05);
      box-shadow: 0 0 15px var(--mat-sys-primary);
      opacity: 1;
    }
    
    .theme-section-title {
      font-weight: 500;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .theme-item {
      padding: 0.25rem 0.5rem;
      margin: 0.25rem 0;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    
    /* Theme colors */
    .indigo-theme {
      color: #3f51b5;
    }
    
    .purple-theme {
      color: #673ab7;
    }
    
    .teal-theme {
      color: #009688;
    }
    
    .amber-theme {
      color: #ffc107;
    }
    
    .spring-theme {
      color: #4caf50;
    }
    
    .summer-theme {
      color: #ff9800;
    }
    
    .autumn-theme {
      color: #bf360c;
    }
    
    .winter-theme {
      color: #2196f3;
    }
    
    .connector-line {
      height: 40px;
      width: 2px;
      background-color: var(--mat-sys-outline);
      margin: 0.25rem 0;
    }
    
    .connector-split {
      width: 80%;
      height: 2px;
      background-color: var(--mat-sys-outline);
      position: relative;
      margin-bottom: 20px;
    }
    
    .connector-split:before,
    .connector-split:after {
      content: '';
      position: absolute;
      height: 20px;
      width: 2px;
      background-color: var(--mat-sys-outline);
      bottom: 0;
    }
    
    .connector-split:before {
      left: 25%;
      transform: translateX(-50%);
      bottom: -20px;
    }
    
    .connector-split:after {
      right: 25%;
      transform: translateX(50%);
      bottom: -20px;
    }
    
    .empty-placeholder {
      height: 100px;
    }
    
    /* Highlight effects */
    .highlight {
      box-shadow: 0 0 12px var(--mat-sys-primary);
      transform: translateY(-3px);
      border-width: 2px;
      z-index: 5;
    }
    
    .active-section {
      border-width: 3px;
      box-shadow: 0 0 15px var(--mat-sys-primary);
    }
    
    /* Animation caption */
    .animation-caption {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 4px;
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      text-align: center;
      animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @media (max-width: 768px) {
      .section-box {
        width: 90%;
        margin: 0.5rem 0;
      }
      
      .section-row {
        flex-direction: column;
        align-items: center;
      }
      
      .connector-split {
        display: none;
      }
    }
  `],
  animations: [
    trigger('highlightSection', [
      state('active', style({
        boxShadow: '0 0 15px var(--mat-sys-primary)',
        transform: 'translateY(-5px)'
      })),
      state('inactive', style({
        boxShadow: 'none',
        transform: 'translateY(0)'
      })),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class ThemeHierarchyDiagramComponent {

  _baseThemes = signal(THEME_CONFIG.themeOptions)
  _seasonalThemes = signal(SEASON_THEME_CONFIG.themeOptions)

  //- - - - - - - - - - - - - - -//

  highlightedSection: 'root' | 'main' | 'seasons' | null = null;
  isAnimating = false;
  currentStep = 0;

  animationSteps = [
    'In Main section, the Material themes from Root are available',
    'When navigating to Seasons section, seasonal themes replace Material themes',
    'When returning to Main section, original Material themes are restored'
  ];

  //- - - - - - - - - - - - - - -//

  showAnimation() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.currentStep = 0;

    // Start animation sequence
    const animationInterval = setInterval(() => {
      this.currentStep++;

      if (this.currentStep >= this.animationSteps.length) {
        this.currentStep = 0;
        clearInterval(animationInterval);

        // Wait a moment on the final step before ending animation
        setTimeout(() => {
          this.isAnimating = false;
        }, 2000);
      }
    }, 3000); // Change steps every 3 seconds
  }
}