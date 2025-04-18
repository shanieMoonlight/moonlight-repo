import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeSelectorComponent } from "@moonlight/ng/theming/selector";
import { MatEverythingModule } from '@moonlight/ng/theming/utils';
import { ThemeShowcaseMatComponent } from '@moonlight/ng/theming/showcase';

@Component({
  selector: 'ml-theming',
  imports: [
    MatEverythingModule,
    ThemeSelectorComponent,
    ThemeShowcaseMatComponent
  ],
  templateUrl: './theming.component.html',
  styleUrl: './theming.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemingComponent {



}
