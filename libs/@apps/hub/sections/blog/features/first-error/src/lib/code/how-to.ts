
  export const directiveSkeletonCode = `@Directive({
  selector: '[sbFormControlFirstError]',
  standalone: true
})
export class FirstErrorDirective implements OnDestroy {
    private _platformId = inject(PLATFORM_ID);
    private _renderer = inject(Renderer2);
    private _host: ElementRef<HTMLElement> = inject(ElementRef);

    //This will be the actual form we are working with.
    @Input({ required: true }) set sbFormControlFirstError(form: FormGroup) {
        this._form = form;
        this.observeValueChanges(this._form);
    }
  
    // Custom error messages map to override default error messages.
    // If map returns undefined for a specific error, the default message map will be used.
    @Input() customErrorMessages?: CustomErrorMessageMap;

   //If true, errors will be shown immediately for untouched controls. 
   // If false, errors will only be shown after the control is touched.
    @Input() showUntouched: boolean = false;
    // ...rest of directive...

}`;

  export const observeValueChangesCode = `private observeValueChanges(form: FormGroup) {
  
  //Skip the server-side rendering check
  if (!isPlatformBrowser(this._platformId)) 
    return;
  
  this._vcSub?.unsubscribe();
  //set _vcSub so we can clean up in onDestroy
  this._vcSub = form.statusChanges
    .pipe(
      // Start with non-INVALID. This gets the ball rolling.
      // So if the form started in an invalid state, the invalid controls will have listeners added
      startWith('PENDING'), 
      //Only react to INVALID status changes
      filter(() => form.status === 'INVALID'),
      //Find invalid controls and map their data
      map(() => FormUtility.findInvalidControlsData(form))
    )
    .subscribe((invalidControlData) => {

      for (const controlData of invalidControlData) {
        const control = controlData.control;
        const name = controlData.name;
        
        // Skip if firstError is already set
        if (control.errors?.['firstError']) 
            continue;

        // If showUntouched is true or control is touched, set the first error message
        if (this.showUntouched || control.touched) {
          FormErrors.setFirstErrorMessage(name, control, this.customErrorMessages);
        } else if (!control.touched) {
          // Not touched but still invalid. So add a blur listener (if none is already set) 
          // to trigger error message on focus out
          if (!this.blurListeners.has(name)) 
            this.addBlurListener(name, control);
        }

      }
    });
}`;

  export const blurListenerCode = `private addBlurListener(controlName: string, control: AbstractControl): void {
  
  // Find the input element by formControlName
  const input: HTMLElement | null = this._host.nativeElement.querySelector(\`[formControlName="\${controlName}"]\`);
  //If no input found, skip it
  if (!input) 
    return;

  const unlisten = this._renderer.listen(input, 'focusout', () => {
    //If firstError is not already set, set it.
    if (!control.errors?.['firstError']) {
      FormErrors.setFirstErrorMessage(
        controlName, 
        control, 
        this.customErrorMessages);
    }
    unlisten(); //unsubscribe from the event listener after setting the error. (Avoid memory leaks).
    this.blurListeners.delete(controlName); //Remove the listener from the cache
  });

  //ControlName and listener function are stored in a Cache/Map so we can remove it later
  this.blurListeners.set(controlName, unlisten);
}



private removeAllBlurListeners() {
    //Stop listenting and clear the cache.
    for (const unlisten of this.blurListeners.values()) {
        unlisten();
    }

    this.blurListeners.clear();
}`;

  export const setFirstErrorMessageCode = `static setFirstErrorMessage(
  name: string,
  control: AbstractControl,
  customErrorMessages?: CustomErrorMessageMap
): void {
  const currentErrors = control.errors;
  const firstError = FormErrors.getFirstErrorMessage(name, control, customErrorMessages);

  //If firstError was found, set it on the control's errors
  if (firstError)
    control.setErrors(
      { ...currentErrors, firstError: firstError },
      { emitEvent: false }
    );
}`;

  export const findInvalidControlsDataCode = `public static findInvalidControlsData(form: FormGroup): ControlData[] {
  const invalid: { name: string, control: AbstractControl }[] = [];
  const controls = form.controls;

  for (const name in controls) {
    const control = controls[name];
    //If the control is invalid, push its name and control reference to the invalid array
    if (control.invalid)
      invalid.push({ name, control });
  }
  return invalid;
}`;

  export const firstErrorHtmlDiplayCode = ` @if(this.control().errors?.['firstError']; as err) {
        <span class="error">
          {{err}}
        </span>
    }`;

 export const fullDirectiveCode = `@Directive({
  selector: '[sbFormControlFirstError]',
  standalone: true
})
export class FirstErrorDirective implements OnDestroy {

  private _platformId = inject(PLATFORM_ID);
  private _renderer = inject(Renderer2);
  private _host: ElementRef<HTMLElement> = inject(ElementRef);

  @Input({ required: true }) set sbFormControlFirstError(form: FormGroup) {
    this._form = form
    this.observeValueChanges(this._form)
  }

  /** 
   * Custom error messages map to override default error messages.
   * If map returns undefined for a specific error, the default message map will be used.
   */
  @Input() customErrorMessages?: CustomErrorMessageMap;

  /**
   * If true, errors will be shown immediately for untouched controls.
   * If false, errors will only be shown after the control is touched.
   * Default is false.
   */
  @Input() showUntouched: boolean = false; 

  //- - - - - - - - - - - - - - //

  private _form?: FormGroup
  private _vcSub?: Subscription
  private blurListeners = new Map<string, () => void>()

  //----------------------------//

  ngOnDestroy(): void {
    this._vcSub?.unsubscribe()
    this.removeAllBlurListeners();
  }

  //----------------------------//

  private addBlurListener(controlName: string, control: AbstractControl): void {

    // Find the input element by formControlName
    const input: HTMLElement | null = this._host.nativeElement.querySelector(\`[formControlName="\${controlName}"]\`);

    if (!input)
      return;

    // Use Renderer2 to listen for 'focusout'
    const unlisten = this._renderer.listen(input, 'focusout', () => {
      if (!control.errors?.['firstError']) {
        FormErrors.setFirstErrorMessage(
          controlName,
          control,
          this.customErrorMessages
        );
      }
      // Remove the event listener after setting the error
      unlisten();
      this.blurListeners.delete(controlName);
    });

    this.blurListeners.set(controlName, unlisten);
  }

  //- - - - - - - - - - - - - - //

  private removeAllBlurListeners() {

    for (const unlisten of this.blurListeners.values()) 
      unlisten()
    
    this.blurListeners.clear();
  }

  //----------------------------//


  private observeValueChanges(form: FormGroup) {

    if (!isPlatformBrowser(this._platformId))
      return;

    this._vcSub?.unsubscribe()
    this._vcSub = form.statusChanges
      .pipe(
        // Start with non-Invalid so the first error will be set on blur if the user clicks input without entering any data
        startWith('PENDING'), 
        filter(() => form.status === 'INVALID'),
        map(() => FormUtility.findInvalidControlsData(form))
      )
      .subscribe((invalidControlData) => {

        for (const controlData of invalidControlData) {
          const control = controlData.control;
          const name = controlData.name;

          // Skip if firstError is already set
          if (control.errors?.['firstError'])
            continue;


          if (this.showUntouched || control.touched) {
            FormErrors.setFirstErrorMessage(name, control, this.customErrorMessages);
          } else if (!control.touched) {
            // Add blur listener if not already present
            if (!this.blurListeners.has(name)) 
              this.addBlurListener(name, control);            
          }
        }
      })
  }

}//Cls
`;



 export const getFirstErrorMessageCode = `
static getFirstErrorMessage(
        name: string,
        control: AbstractControl,
        customErrorMessages?: CustomErrorMessageMap): string | null {

        const errorKey = this.firstErrorKey(control)
        //if no error key is found, return null
        if (!errorKey)
            return null

        //Get the actual error value. May be an object or a string.
        const errorValue = control.errors?.[errorKey]
        const fieldName = this.toTitleCase(name)

        // if the error value is a string, return it directly
        if (typeof errorValue === 'string')
            return errorValue

        // Try to find an ErrorMessageFunction that can convert the error into a useful message.
        // First look in the (user defined) customErrorMessages map, then fall back to the default errorMessage
        const errorMessageFn = customErrorMessages?.get(errorKey) ?? errorMessageMap.get(errorKey);


        // If we found an error message function, call it with the field name and error value
        if (errorMessageFn)
            return errorMessageFn(fieldName, errorValue)

        // Fallback for unknown error types
        return \`Invalid value for \${fieldName}.\`
    }


    //----------------------------//


    //Look for any errors and return the first error key of null.
    private static firstErrorKey = (control: AbstractControl): string | null =>
        Object.keys(control.errors || {}).length > 0 
        ? Object.keys(control.errors || {})[0] 
        : null;


    //----------------------------//


    private static toTitleCase(s: string): string {
        const result = s.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }
 `;


 export const errorsMessageMapCode = `//A function type that takes a field name and an error value, returning a string message. 
// The returned string message will be diplayed in the template.
export type ErrorMessageFunction = (fieldName: string, errorValue: any) => string;


export type CustomErrorMessageMap = Map<string, ErrorMessageFunction>;

//Create a  map of common error fieldNames vs a function to convert the error into a useful message. 
const errorMessageMap: CustomErrorMessageMap = new Map<string, ErrorMessageFunction>([
    ['required', (fieldName) => \`\${fieldName} is required.\`],
    ['email', () => 'Please enter a valid email address.'],
    ['minlength', (fieldName, errorValue) => !errorValue ? 'Value is too short' : \`\${fieldName} must be at least \${errorValue?.requiredLength} characters.\`],
    ['maxlength', (fieldName, errorValue) => !errorValue ? 'Value is too long' : \`\${fieldName} must be no more than \${errorValue?.requiredLength} characters.\`],
    ['pattern', (fieldName) => \`\${fieldName} format is invalid.\`],
    ['min', (fieldName, errorValue) => !errorValue ? 'Value is too small' : \`\${fieldName} must be at least \${errorValue?.min}.\`],
    ['max', (fieldName, errorValue) => !errorValue ? 'Value is too large' : \`\${fieldName} must be no more than \${errorValue?.max}.\`],
    ['passwordMismatch', () => 'Passwords do not match.'],
    ['mustMatch', () => 'Fields do not match.'],
    ['whitespace', (fieldName) => \`\${fieldName} cannot contain only whitespace.\`],
    ['forbiddenValue', (fieldName, errorValue) => !errorValue ? 'This value is not allowed' : \`\${fieldName} cannot be "\${errorValue?.value}".\`],
    ['asyncValidation', (fieldName) => \`\${fieldName} validation is pending...\`],
    ['invalidDate', () => 'Please enter a valid date.'],
    ['futureDate', () => 'Date must be in the future.'],
    ['pastDate', () => 'Date must be in the past.'],
    ['strongPassword', () => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'],
    ['phoneNumber',  (fieldName, errorValue) => !errorValue.message ?'Please enter a valid phone number.': errorValue.message],
    ['url', () => 'Please enter a valid URL.'],
    ['unique', (fieldName) => \`This \${fieldName.toLowerCase()} is already taken.\`],
    ['fileSize', (fieldName, errorValue) => !errorValue ? 'File is too large' : \`File size must be less than \${errorValue?.maxSize}.\`],
    ['fileType', (fieldName, errorValue) => !errorValue ? 'Invalid file type' : \`Only \${errorValue?.allowedTypes?.join(', ')} files are allowed.\`]
]);
 
 `;

  export const firstErrorUsageHtmlCode=`
  <!-- Pass the form to the directive so it can listen for changes: [sbFormControlFirstError]="_form" -->
  <form [formGroup]="_form" [sbFormControlFirstError]="_form" (ngSubmit)="_login()" class="login-form">

  <div class="form-group">
    <label for="email">Email</label>
    <input 
      sbInputStyle  
      id="email" 
      type="email" 
      formControlName="email" 
      placeholder="Enter your email" />
    <!-- Use helper component to dislay the error.-->
    <sb-first-error [control]="_form.get('email')!" />
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
   <div class="password-input-container" sbInputWithBtn >
      <input
        [id]="'password'"
        [type]="showPassword() ? 'text' : 'password'"
        formControlName="password"
        placeholder="Enter your password"/>
      <sb-toggle-icon-button        
        toggledLabel="Hide password"
        untoggledLabel="Show password"
        (toggled)="onPasswordToggle($event)"/>
    </div>
    <!-- Use helper component to dislay the error.-->
    <sb-first-error [control]="_form.get('password')!" />
  </div>
  
  <sb-button type="submit" [disabled]="_form.invalid" color="primary">
    Login
  </sb-button>
</form>
<div class="demo-hint">
  <b>Password requirements:</b> At least 6 characters, must include an uppercase letter, an uppercase letter, a number.
</div>
  `;

  

  export const firstErrorComponentTsCode=`import { NgTemplateOutlet } from '@angular/common';
import { Component, input, TemplateRef } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: 'sb-first-error',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: \`
    @if(this.control().errors?.['firstError']; as err) {
       @if(customErrorTemplate(); as template){
         <ng-container 
          [ngTemplateOutlet]="template" 
          [ngTemplateOutletContext]="{errorMessage: err}"/>
        }@else {
          <span class="error" 
                [attr.aria-live]="'polite'"
                [attr.role]="'alert'">
            {{err}}
          </span>
        }
    }
  \`,
  styles: [\`
    :host {
      display: block;
     --error-color: var(--mat-sys-error, #d9534f);
    }
    .error {
      color: var(--error-color, #d9534f );
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
      animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-2px); }
      to { opacity: 1; transform: translateY(0); }
    }
  \`]
})
export class FirstErrorComponent {

  control = input.required<AbstractControl>();
  customErrorTemplate = input<TemplateRef<unknown> | undefined>(undefined)

}
  `;

  export const firstErrorComponentUsageHtmlCode = `<sb-first-error [control]="_form.get('password')!" />`