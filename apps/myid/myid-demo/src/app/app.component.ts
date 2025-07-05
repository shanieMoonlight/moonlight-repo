import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [ RouterModule],
  selector: 'sb-root',
  template: `<router-outlet/>`,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'tester';
}
