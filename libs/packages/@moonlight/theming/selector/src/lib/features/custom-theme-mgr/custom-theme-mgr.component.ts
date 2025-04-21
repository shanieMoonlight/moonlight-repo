// filepath: libs/packages/@moonlight/theming/selector/src/lib/custom-theme-manager/custom-theme-manager.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ThemeValue } from '@moonlight/material/theming/config';
import { ThemeService } from '@moonlight/material/theming/service'; // Adjust path
import { MatEverythingModule } from '@moonlight/material/theming/utils';
import { MlThemeAvatarComponent } from '@moonlight/material/theming/ui';

@Component({
  selector: 'ml-custom-theme-mgr',
  imports: [MatEverythingModule, MlThemeAvatarComponent],
  templateUrl: './custom-theme-mgr.component.html',
  styleUrl: './custom-theme-mgr.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MlCustomThemeMgrComponent {

  protected _themeService = inject(ThemeService);
  // OPtional in case this component is used outside of a dialog
  private _dialogRef? = inject(MatDialogRef<MlCustomThemeMgrComponent>, { optional: true });

  protected _isDialog = signal(!!this._dialogRef);

  //- - - - - - - - - - - - - - -//

  // Expose the signal directly for the template
  protected customThemes = this._themeService.customThemes;

  //-----------------------------//

  protected deleteTheme(themeValue: ThemeValue): void {
    // Optional: Add confirmation dialog
    console.log(`Attempting to delete theme: ${themeValue}`);
    this._themeService.removeCustomTheme(themeValue);
  }

  //-----------------------------//

  protected closeDialog = () =>
    this._dialogRef?.close()

  //-----------------------------//

}//Cls

