import { ChangeDetectionStrategy, Component, computed, inject, input, Input, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThemeOption } from '@moonlight/material/theming/config';
import { MatEverythingModule } from '@moonlight/material/theming/utils';
import { MlThemeAvatarComponent } from '@moonlight/material/theming/ui';

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
    MlThemeAvatarComponent
  ],
  templateUrl: './theme-saved.component.html',
  styleUrl: './theme-saved.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MlCustomThemeSavedComponent {

  // Inject dialog data
  private _dialogData: CustomThemeSavedDialogData = inject(MAT_DIALOG_DATA, { optional: true });
  private _dialogRef = inject(MatDialogRef<MlCustomThemeSavedComponent>, { optional: true });

  //- - - - - - - - - - - - - - -//

  //Do not use in html - use the _themeSignal (Which will try dialog data first)
  _theme = input.required<ThemeOption>({ alias: 'theme' })

  //- - - - - - - - - - - - - - -//

  protected _isDialog = signal(!!this._dialogRef);
  protected _themeSignal = computed(() => this._dialogData?.theme ?? this._theme());

  //-----------------------------//

  // Method to close the dialog
  closeDialog = () =>
    this._dialogRef?.close()

}//Cls
