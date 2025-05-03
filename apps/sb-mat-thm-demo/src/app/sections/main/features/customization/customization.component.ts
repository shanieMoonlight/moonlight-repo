import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SbThemeSelectorComponent } from "@spider-baby/material-theming/customizer";
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { SbThemeShowcaseMatComponent } from '@spider-baby/material-theming/showcase';
import { CustomizationCodeBehindComponent } from './ui/code-behind.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'sb-customization',
  imports: [
    MatEverythingModule,
    SbThemeSelectorComponent,  //<--- Select Custom Themes
    SbThemeShowcaseMatComponent, //<--- Showcase Custom Themes
    CustomizationCodeBehindComponent
  ],
  templateUrl: './customization.component.html',
  styleUrl: './customization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDemoCustomizationComponent {

  
  private _dialog = inject(MatDialog);

  
  openCodeDialog(): void {
    this._dialog.open(CustomizationCodeBehindComponent, {
      width: '80vw', // Adjust width as needed
      maxWidth: '900px', // Adjust max-width as needed
    });
  }

}
