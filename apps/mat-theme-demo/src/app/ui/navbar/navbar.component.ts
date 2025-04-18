import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { MatEverythingModule } from '@moonlight/ng/theming/utils';

@Component({
  selector: 'ml-navbar',
  imports: [
    MatEverythingModule,
    NgTemplateOutlet
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {


  _rhsOutletTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'rhsOutletTemplate' })


}
