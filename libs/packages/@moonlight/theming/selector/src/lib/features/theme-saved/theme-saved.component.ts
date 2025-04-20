import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThemeOption } from '@moonlight/ng/theming/config';
import { MatEverythingModule } from '@moonlight/ng/theming/utils';
import { ThemeAvatarComponent } from '../../ui/avatar/theme-avatar.component';

//##########################################//

// Interface for the expected dialog data
export interface CustomThemeSavedDialogData {
  theme: ThemeOption
}

//##########################################//

@Component({
  selector: 'ml-custom-theme-saved',
  imports: [
    MatEverythingModule,
    ThemeAvatarComponent],
  templateUrl: './theme-saved.component.html',
  styleUrl: './theme-saved.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomThemeSavedComponent {

  // Inject dialog data
  private _dialogData: CustomThemeSavedDialogData = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject(MatDialogRef<CustomThemeSavedComponent>);

  //- - - - - - - - - - - - - - -//

  // Use the injected data to set the signal input
  protected _theme = signal<ThemeOption>(this._dialogData.theme);

  //-----------------------------//

  // Method to close the dialog
  closeDialog = () =>
    this._dialogRef.close()

}
