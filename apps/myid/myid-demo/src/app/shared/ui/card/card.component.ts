import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbIconButtonComponent, SbTextButtonComponent } from '@spider-baby/ui-kit/buttons';

@Component({
  selector: 'sb-myid-card',
  standalone: true,
  imports: [
    SbTextButtonComponent,
    SbIconButtonComponent,
    RouterModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'color()',
  }
})
export class MyIdCardComponent {

  icon = input<string | undefined>();
  title = input<string | undefined>();
  content = input<string | undefined>();
  route = input<string | undefined>();
  action = input<string | undefined>('EXPLORE');
  color = input<string | undefined>('primary');


}
