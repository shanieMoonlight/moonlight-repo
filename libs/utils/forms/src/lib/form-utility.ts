import { AbstractControl, FormArray, FormGroup } from "@angular/forms";

export class FormUtility {

  public static findInvalidControlNames(form: FormGroup): Set<string> {

    const invalid = new Set<string>()
    const controls = form.controls

    for (const name in controls) {
      if (controls[name].invalid)
        invalid.add(name)
    }

    return invalid
  }

  //----------------------------//

  public static findInvalidControlInfo(form: FormGroup): Set<string> {

    const invalid = new Set<string>()
    const controls = form.controls

    for (const name in controls) {
      if (controls[name].invalid)
        invalid.add(`${name}: ${this.firstErrorKey(controls[name]) || 'Invalid'}`)
    }

    return invalid
  }

  //----------------------------//

  public static findInvalidControls(form: FormGroup): AbstractControl[] {

    const invalid = []
    const controls = form.controls

    for (const name in controls) {
      if (controls[name].invalid)
        invalid.push(controls[name])
    }

    return invalid
  }

  //----------------------------//

  public static findInvalidControlsData(form: FormGroup): AbstractControl[] {
    const invalid: AbstractControl[] = [];
    this.collectInvalidControlsData(form, invalid)
    return invalid
  }

  //----------------------------//

  private static collectInvalidControlsData(
    control: AbstractControl,
    invalid: AbstractControl[],
  ): void {

    if (control.disabled)
      return

    if (control.valid)
      return

    if (control instanceof FormGroup) {
      for (const name in control.controls)
        this.collectInvalidControlsData(control.controls[name], invalid)
      return
    }

    if (control instanceof FormArray) {
      for (let i = 0; i < control.length; i++)
        this.collectInvalidControlsData(control.at(i), invalid)
      return
    }

    invalid.push(control)
  }

  //----------------------------//


  static replaceNullWithUndefined(obj: Record<string, any>): Record<string, any> {

    for (const [key, value] of Object.entries(obj)) {
      if (value === null)
        obj[key] = undefined;
    }
    return obj;
  }

  //----------------------------//

  static getFirstFormError(form: FormGroup): Record<string, any> | null {

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

  static firstErrorKey = (control: AbstractControl): string | null =>
    Object.keys(control.errors || {}).length > 0
      ? Object.keys(control.errors || {})[0]
      : null;


}//Cls