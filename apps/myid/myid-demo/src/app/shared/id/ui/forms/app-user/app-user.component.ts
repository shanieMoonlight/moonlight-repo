import { ChangeDetectionStrategy, Component, inject, Input, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirstErrorComponent, FirstErrorDirective } from '@spider-baby/utils-forms';
import { IdentityAddressDto } from '../../../../io/models/identity-address-dto';
import { TwoFactorProvider } from '../../../../io/models/two-factor-provider';
import { SbButtonComponent } from '../../../../ui/buttons';
import { SbCheckboxComponent } from '../../../../ui/checkbox/checkbox.component';
import { SbInputStyleDirective } from '../../../../ui/input/input.directive';
import { SbSelectComponent } from '../../../../ui/select/select.component';
import { teamPositionOptions } from '../../../utils/team-position-options';
import { twoFactorProviderOptions } from '../../../utils/two-factor-provider-options';

//##########################//

export interface AppUserDtoFormDto {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userName: string;
  email: string;
  teamId: string;
  teamPosition: number;
  twoFactorProvider: TwoFactorProvider;
  twoFactorEnabled: boolean;
  address?: IdentityAddressDto;
}

interface AppUserForm {
  id: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<string>;
  userName: FormControl<string>;
  email: FormControl<string>;
  teamId: FormControl<string>;
  teamPosition: FormControl<number>;
  twoFactorProvider: FormControl<TwoFactorProvider>;
  twoFactorEnabled: FormControl<boolean>;
  // Address fields - updated to match IdentityAddressDto
  line1: FormControl<string>;
  line2: FormControl<string>;
  line3: FormControl<string>;
  line4: FormControl<string>;
  line5: FormControl<string>;
  areaCode: FormControl<string>;
  notes: FormControl<string>;
  appUserId: FormControl<string>;
}

//##########################//

@Component({
  selector: 'sb-app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    SbButtonComponent,
    SbInputStyleDirective,
    SbSelectComponent,
    SbCheckboxComponent
  ],
  templateUrl: './app-user.component.html',
  styleUrl: './app-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbAppUserFormComponent {

  private fb = inject(FormBuilder);

  showLables = input<boolean>(true);
  addUser = output<AppUserDtoFormDto>();
  updateUser = output<AppUserDtoFormDto>();

  protected showAddressSection = input(false);

  @Input()
  public set appUser(user: AppUserDtoFormDto | undefined) {
    this.setFormValues(user);
    this._isUpdateForm.set(!!user);
  }

protected _isUpdateForm = signal(false);

  protected _twoFactorProviderOptions = twoFactorProviderOptions

  protected _teamPositionOptions= teamPositionOptions

  protected form: FormGroup<AppUserForm> = this.fb.nonNullable.group({
    // Personal Information Section
    id: ['', [Validators.required]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]+$/)]],

    // Account Information Section
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    teamId: ['', [Validators.required]],
    teamPosition: [1 as number, [Validators.required]],

    // Security Settings Section
    twoFactorProvider: ['email' as TwoFactorProvider, [Validators.required]],
    twoFactorEnabled: [false],    // Address Section (Optional)
    line1: [''],
    line2: [''],
    line3: [''],
    line4: [''],
    line5: [''],
    areaCode: [''],
    notes: [''],
    appUserId: ['']
  })


  //---------------------//


  setFormValues(user: AppUserDtoFormDto | undefined) {
    if (user) {
      this.form.patchValue({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        userName: user.userName,
        email: user.email,
        teamId: user.teamId,
        teamPosition: user.teamPosition,
        twoFactorProvider: user.twoFactorProvider || 'email',
        twoFactorEnabled: user.twoFactorEnabled || false,
        line1: user.address?.line1 || '',
        line2: user.address?.line2 || '',
        line3: user.address?.line3 || '',
        line4: user.address?.line4 || '',
        line5: user.address?.line5 || '',
        areaCode: user.address?.areaCode || '',
        notes: user.address?.notes || '',
        appUserId: user.address?.appUserId || user.id || ''
      });
    } else {
      this.form.reset();
    }
  }


  //- - - - - - - - - - -//


  extractFormValues(form: FormGroup<AppUserForm>): AppUserDtoFormDto {

    const formValue = form.value;    // Build address object if any address fields are filled
    const address: IdentityAddressDto | undefined =
      (formValue.line1 || formValue.line2 || formValue.line3 || formValue.line4 || formValue.line5 || formValue.areaCode || formValue.notes)
        ? {
          line1: formValue.line1 || undefined,
          line2: formValue.line2 || undefined,
          line3: formValue.line3 || undefined,
          line4: formValue.line4 || undefined,
          line5: formValue.line5 || undefined,
          areaCode: formValue.areaCode || undefined,
          notes: formValue.notes || undefined,
          appUserId: formValue.appUserId || this.form.controls.id.value || undefined,
        }
        : undefined;

    const dto: AppUserDtoFormDto = {
      id: this.form.controls.id.value,
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value,
      phoneNumber: this.form.controls.phoneNumber.value,
      userName: this.form.controls.userName.value,
      email: this.form.controls.email.value,
      teamId: this.form.controls.teamId.value,
      teamPosition: this.form.controls.teamPosition.value,
      twoFactorProvider: this.form.controls.twoFactorProvider.value,
      twoFactorEnabled: this.form.controls.twoFactorEnabled.value,
      address
    };

    return dto;
  }
  

  //- - - - - - - - - - -//


  add() {
    if (!this.form.valid)
      return;

    const dto: AppUserDtoFormDto = this.extractFormValues(this.form)
    this.addUser.emit(dto);
  }


  //- - - - - - - - - - -//


  update() {
    if (!this.form.valid)
      return;

    const dto: AppUserDtoFormDto = this.extractFormValues(this.form)
    this.updateUser.emit(dto);
  }


}//Cls
