import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'sb-root',
  template: `
    <router-outlet />
  `,
  styles: `
    :host{
      display: block;
    }
  `,
})
export class AppComponent {
  title = 'spider-baby-mat-theming';
}
