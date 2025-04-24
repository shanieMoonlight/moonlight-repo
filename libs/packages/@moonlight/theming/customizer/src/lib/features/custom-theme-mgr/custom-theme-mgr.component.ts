// filepath: libs/packages/@moonlight/theming/customizer/src/lib/custom-theme-manager/custom-theme-manager.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ThemeValue } from '@moonlight/material-theming/config';
import { ThemeService } from '@moonlight/material-theming/service'; // Adjust path
import { consoleDev, MatEverythingModule } from '@moonlight/material-theming/utils';
import { MlThemeAvatarComponent } from '@moonlight/material-theming/ui';

/**
 * A component for managing custom themes in the theme system.
 * 
 * Provides a UI for viewing, selecting, and deleting custom themes.
 * Can be used standalone or within a dialog.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <ml-custom-theme-mgr></ml-custom-theme-mgr>
 * 
 * <!-- Usage in dialog -->
 * this._dialog.open(MlCustomThemeManagerComponent, {
 *   width: '600px'
 * });
 * ```
 */
@Component({
  selector: 'ml-custom-theme-mgr',
  imports: [MatEverythingModule, MlThemeAvatarComponent],
  templateUrl: './custom-theme-mgr.component.html',
  styleUrl: './custom-theme-mgr.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MlCustomThemeManagerComponent  {

  protected _themeService = inject(ThemeService);
  // OPtional in case this component is used outside of a dialog
  private _dialogRef? = inject(MatDialogRef<MlCustomThemeManagerComponent >, { optional: true });

  protected _isDialog = signal(!!this._dialogRef);

  //- - - - - - - - - - - - - - -//

  // Expose the signal directly for the template
  protected customThemes = this._themeService.customThemes;

  //-----------------------------//
 
  /**
   * Removes a custom theme from storage.
   * @param themeValue The unique identifier of the theme to delete
   */
  protected deleteTheme(themeValue: ThemeValue): void {
    // Optional: Add confirmation dialog
    consoleDev.log(`Attempting to delete theme: ${themeValue}`);
    this._themeService.removeCustomTheme(themeValue);
  }

  //- - - - - - - - - - - - - - -//

  /**
   * Closes the dialog if this component is being used within a MatDialog.
   * Has no effect when used as a standalone component.
   */
  protected closeDialog = () =>
    this._dialogRef?.close()

  //-----------------------------//

}//Cls

