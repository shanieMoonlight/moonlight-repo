import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sb-main-demo-code',
  imports: [
    MatEverythingModule,
    HighlightModule
  ],
  template: `
      <div class="code-display">
      <mat-tab-group>
        <mat-tab label="TypeScript">
          <pre><code [highlight]="_tsCode()" language="typescript"></code></pre>
        </mat-tab>
        <mat-tab label="HTML">
          <pre><code [highlight]="_htmlCode()" language="html"></code></pre>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      justify-content: center;
      align-items: center;
    }

    .code-display {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoCodeComponent {

  _htmlCode = input.required<string>({ alias: 'html' });
  _tsCode = input.required<string>({ alias: 'typescript' });
}
