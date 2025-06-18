import { AbstractControl, FormGroup } from "@angular/forms";

export class FormUtility {

  public static findInvalidControlNames(form: FormGroup): Set<string> {

    const invalid = new Set<string>();
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid)
        invalid.add(name)
    }
    return invalid

  }
  public static findInvalidControlInfo(form: FormGroup): Set<string> {

    const invalid = new Set<string>();
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid)
        invalid.add(name + ': ' + this.firstErrorKey(controls[name]) || 'Invalid')
    }
    return invalid

  }

  //----------------------------//

  public static findInvalidControls(form: FormGroup): AbstractControl[] {

    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid)
        invalid.push(controls[name]);

    }
    return invalid

  }

  //----------------------------//

  public static findInvalidControlsData(form: FormGroup): { name: string, control: AbstractControl }[] {

    const invalid: { name: string, control: AbstractControl }[] = [];
    const controls = form.controls;
    for (const name in controls) {
      const control = controls[name];
      if (control.invalid)
        invalid.push({ name, control });

    }
    return invalid

  }

  //----------------------------//


  static replaceNullWithUndefined(obj: Record<string, any>): Record<string, any> {
    for (const [key, value] of Object.entries(obj)) {
      if (value === null) {
        obj[key] = undefined;
      }
    }
    return obj;
  }

  //----------------------------//

  getFirstFormError(form: FormGroup): Record<string, any> | null {
    if (form.valid)
      return null

    // Check form-level errors first
    if (form.errors) {
      const firstKey = Object.keys(form.errors)[0]
      return { [firstKey]: form.errors[firstKey] }
    }

    // Check control-specific errors
    for (const key of Object.keys(form.controls)) {
      const control = form.get(key)
      if (control?.errors) {
        const errorKey = Object.keys(control.errors)[0]
        return { [errorKey]: control.errors[errorKey] }
      }
    }

    return null
  }

  //----------------------------//

  private static firstErrorKey = (control: AbstractControl): string | null =>
    Object.keys(control.errors || {}).length > 0 ? Object.keys(control.errors || {})[0] : null;


}//Cls