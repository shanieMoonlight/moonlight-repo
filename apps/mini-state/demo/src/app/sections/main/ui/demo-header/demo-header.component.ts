import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MainConstants } from '../../config/constants';

@Component({
  selector: 'sb-main-demo-header',
  imports: [],
  template: `
  <h1 class="api-header">This Dummy IO Service geneates random data with random quantities and operates with a 
    failure rate of {{ _failureRate() }}% for demo purposes to showcase error messages.</h1>
  <p class="subscript">Checkout the code below. 👇</p>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      text-align: center;
    }
    .api-header {
      font-size: 1rem;
      // font-weight: bold;
      color: #d9534f; /* Bootstrap danger color for emphasis */
      margin-bottom: 2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoHeaderComponent {

  protected _failureRate = signal(MainConstants.API_FAILURE_RATE * 100)
}
