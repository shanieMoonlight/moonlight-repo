
import { FormControl } from "@angular/forms";
import { TwoFactorProvider } from "@spider-baby/myid-io/models";

export interface UpdateSelfFormDto {
  id: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email: string;
  phoneNumber: string;
  twoFactorProvider?: TwoFactorProvider
  twoFactorEnabled?: boolean;
}

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
