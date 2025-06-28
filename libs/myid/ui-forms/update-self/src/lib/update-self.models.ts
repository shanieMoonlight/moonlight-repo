
import { FormControl } from "@angular/forms";
import { AppUserDto, TwoFactorProvider } from "@spider-baby/myid-io/models";

export type UpdateSelfFormDto = Pick<
  AppUserDto,
  'id'
  | 'firstName'
  | 'lastName'
  | 'userName'
  | 'email'
  | 'phoneNumber'
  | 'twoFactorProvider'
  | 'twoFactorEnabled'
>;

export interface UpdateSelfForm {
  id: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  userName: FormControl<string>;
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
  twoFactorProvider: FormControl<TwoFactorProvider>;
  twoFactorEnabled: FormControl<boolean>;
}
