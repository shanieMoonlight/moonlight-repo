import { Component } from '@angular/core';

@Component({
  selector: 'ml-theme-hierarchy-diagram',
  standalone: true,
  template: `
    <div class="diagram-container">
      <h3>Hierarchical Theme Architecture</h3>
      <pre class="theme-hierarchy-diagram">
┌─────────────────────────────────────────────────────────┐
│                      Root App                           │
│             Base Angular Material Styles                │
│                                                         │
│             Material Themes Defined Here                │
│             - Indigo                                    │
│             - Deep Purple                               │
│             - Teal                                      │
│             - Amber                                     │
└───────────────────────────┬─────────────────────────────┘
                            │
        ┌───────────────────┴─────────────────┐
        │                                     │
┌───────▼──────────────────┐    ┌─────────────▼───────────┐
│      Main Section        │    │     Seasons Section     │
│                          │    │                         │
│  ┌───────────────────┐   │    │ ┌─────────────────────┐ │
│  │ Inherits Material │   │    │ │  Replaces with      │ │
│  │ Themes from Root  │   │    │ │  Seasonal Themes:   │ │
│  │                   │   │    │ │  - Spring           │ │
│  │                   │   │    │ │  - Summer           │ │
│  │                   │   │    │ │  - Autumn           │ │
│  │                   │   │    │ │  - Winter           │ │
│  └───────────────────┘   │    │ └─────────────────────┘ │
│                          │    │                         │
│  ThemePickerComponent    │    │  ThemePickerComponent   │
│  (Shows Material themes) │    │  (Shows Season themes)  │
│                          │    │                         │
└──────────────────────────┘    └─────────────────────────┘
      </pre>
    </div>
  `,
  styles: [`
    .diagram-container {
      margin: 2rem 0;
      background-color: var(--mat-sys-surface-container);
      border-radius: 8px;
      padding: 1rem;
    }
    
    .diagram-container h3 {
      margin-top: 0;
      color: var(--mat-sys-primary);
    }
    
    .theme-hierarchy-diagram {
      font-family: 'Roboto Mono', monospace;
      font-size: 0.85rem;
      white-space: pre;
      overflow-x: auto;
      background-color: var(--mat-sys-surface-container-high);
      padding: 1rem;
      border-radius: 4px;
      color: var(--mat-sys-on-surface);
      line-height: 1.2;
    }
    
    .theme-hierarchy-diagram::-webkit-scrollbar {
      height: 8px;
    }
    
    .theme-hierarchy-diagram::-webkit-scrollbar-thumb {
      background-color: var(--mat-sys-outline-variant);
      border-radius: 4px;
    }
    
    @media (max-width: 768px) {
      .theme-hierarchy-diagram {
        font-size: 0.75rem;
      }
    }
  `]
})
export class ThemeHierarchyDiagramComponent {}