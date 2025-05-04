import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'sb-tutorials-root',
  template: `
    <router-outlet />
  `,
  styles: `    
 :host {
   display: block;
   position: relative;
 }
  `
})
export class AppComponent {
  title = 'spider-baby-tutorials';
}
