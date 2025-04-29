import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MainConstants } from '../../config/constants';

@Component({
  selector: 'sb-main-demo-header',
  imports: [],
  template: `
  <h1 class="api-header">This Dummy IO Service operates with a failure rate of {{ _failureRate() }}% for demo purposes to showcase error messages.</h1>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
    .api-header {
      font-size: 1rem;
      // font-weight: bold;
      color: #d9534f; /* Bootstrap danger color for emphasis */
      text-align: center;
      margin-bottom: 2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoHeaderComponent {

  protected _failureRate = signal(MainConstants.API_FAILURE_RATE * 100)
}
