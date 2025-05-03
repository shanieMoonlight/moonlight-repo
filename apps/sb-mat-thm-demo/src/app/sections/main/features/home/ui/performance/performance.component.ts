import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HomeSectionHdrComponent } from '../section-hdr/section-hdr.component';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';

@Component({
  selector: 'sb-home-performance',
  imports: [
    MatEverythingModule,
    HomeSectionHdrComponent
  ],
  template: `
    <sb-home-section-hdr 
      [sectionNumber]="_sectionNumber()"
      [title]="'Performance Advantages'"/>
        <mat-card>
            <mat-card-header>
                <mat-card-title>Optimized Performance & Bundle Size</mat-card-title>
            </mat-card-header>
            <mat-card-content>
                <p>The library is designed for optimal performance and reduced bundle size:</p>
                <ul class="feature-list">
                    <li>
                        <mat-icon color="primary">palette</mat-icon>
                        <span><strong>Automatic Palette Generation</strong> - Eliminates the need to manually define extensive Material color palettes; just provide seed colors.</span>
                    </li>
                    <li>
                        <mat-icon color="primary">speed</mat-icon>
                        <span><strong>Smaller bundle sizes</strong> - Color palettes are generated at runtime instead of shipping pre-compiled CSS for
                            each theme</span>
                    </li>
                    <li>
                        <mat-icon color="primary">compress</mat-icon>
                        <span><strong>Tree-shakable architecture</strong> - Secondary entry points allow you to import only what you need</span>
                    </li>
                    <li>
                        <mat-icon color="primary">cached</mat-icon>
                        <span><strong>Memoized color generation</strong> - Palette calculations are cached to prevent redundant work</span>
                    </li>
                    <li>
                        <mat-icon color="primary">sync</mat-icon>
                        <span><strong>Batched updates</strong> - DOM changes use requestAnimationFrame for optimal rendering performance</span>
                    </li>
                </ul>
            </mat-card-content>
        </mat-card>  
           
    `,
  styles: `
  @use '../@common/common.scss' as *;
  
    :host {
      display: block;
    }
    
.feature-list {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    mat-icon {
      margin-right: 10px;
      flex-shrink: 0;
    }

    span {
      line-height: 1.4;
    }
  }
}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HomePerformanceComponent {

  _sectionNumber = input.required({ alias: 'sectionNumber' });

}
