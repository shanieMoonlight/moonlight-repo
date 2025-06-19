# Spider Baby Utils Forms

A comprehensive Angular forms utility library that provides streamlined form validation and error handling with automatic error display and user-friendly messaging.

## Overview

This library simplifies Angular form validation by providing:
- **Automatic error detection** and display
- **First error only** display strategy to avoid overwhelming users
- **Accessible error messages** with ARIA attributes
- **Smooth animations** for error state transitions
- **Customizable error messaging** system
- **Touch-based validation** (errors only show after user interaction)

## Core Components

### 🎯 FirstErrorDirective

A powerful directive that automatically manages form validation state and displays the first error for each form control.

**Selector:** `[sbFormControlFirstError]`

#### Features
- Automatically monitors form status changes
- Shows only the first validation error per control
- Respects touched/untouched state (errors only show after user interaction)
- Supports custom error messages
- Memory leak prevention with automatic subscription cleanup

#### Basic Usage

```typescript
// Component
export class LoginFormComponent {
  protected _form: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    rememberMe: [false, []]
  });
}
```

```html
<!-- Template - Apply directive to form element -->
<form [formGroup]="_form" 
      [sbFormControlFirstError]="_form" 
      (ngSubmit)="submit()">
  
  <div class="form-group">
    <input type="email" 
           formControlName="email" 
           placeholder="Enter your email"/>
    <sb-first-error [control]="_form.controls.email"/>
  </div>
  
  <div class="form-group">
    <input type="password" 
           formControlName="password" 
           placeholder="Enter your password"/>
    <sb-first-error [control]="_form.controls.password"/>
  </div>
</form>
```

#### Advanced Configuration

```html
<!-- Custom error messages -->
<form [formGroup]="myForm" 
      [sbFormControlFirstError]="myForm"
      [customErrorMessages]="customMessages">
  <!-- form controls -->
</form>

<!-- Show errors immediately (bypass touch requirement) -->
<form [formGroup]="myForm" 
      [sbFormControlFirstError]="myForm"
      [showUntouched]="true">
  <!-- form controls -->
</form>
```

#### Inputs

| Property                  | Type                    | Default      | Description                         |
| ------------------------- | ----------------------- | ------------ | ----------------------------------- |
| `sbFormControlFirstError` | `FormGroup`             | **required** | The reactive form to monitor        |
| `customErrorMessages`     | `CustomErrorMessageMap` | `undefined`  | Custom error message mappings       |
| `showUntouched`           | `boolean`               | `false`      | Show errors before user interaction |

### 🎨 FirstErrorComponent

A standalone component that displays validation errors with smooth animations and accessibility features.

**Selector:** `sb-first-error`

#### Features
- Displays only the first validation error
- Smooth fade-in animation for error appearance
- ARIA live regions for screen reader compatibility

#### Usage

```html
<!-- Basic usage -->
<sb-first-error [control]="myForm.controls.fieldName"/>

<!-- Real example from login form -->
<input type="email" 
       formControlName="email" 
       placeholder="Enter your email"/>
<sb-first-error [control]="_form.controls.email"/>
```

#### Styling

The component uses CSS custom properties for easy theming:

```css
sb-first-error {
  --error-color: #custom-error-color;
}
```

**Default styling:**
- Color: Material Design error color with fallback (`var(--mat-sys-error, #d9534f);`)
- Font size: 0.875rem
- Smooth fade-in animation
- Accessible spacing and layout

#### Inputs

| Property  | Type              | Description                                          |
| --------- | ----------------- | ---------------------------------------------------- |
| `control` | `AbstractControl` | **Required.** The form control to display errors for |

## Installation & Setup

### 1. Import the Library

```typescript
import { 
  FirstErrorDirective, 
  FirstErrorComponent 
} from '@spider-baby/utils-forms';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    // ...other imports
  ],
  // ...component definition
})
export class MyFormComponent { }
```

### 2. Apply to Your Form

```html
<form [formGroup]="myForm" [sbFormControlFirstError]="myForm">
  <!-- Your form controls with error display -->
  <input formControlName="email" />
  <sb-first-error [control]="myForm.controls.email"/>
</form>
```

## Real-World Example

Here's a complete login form implementation using the library:

```typescript
// login.component.ts
@Component({
  selector: 'sb-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FirstErrorDirective,
    FirstErrorComponent,
    // ...other imports
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private fb = inject(FormBuilder)

  protected _form: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    rememberMe: [false, []]
  });

  submit() {
    if (!this._form.valid) return;
    
    const dto: LoginFormDto = {
      email: this._form.controls.email.value,
      password: this._form.controls.password.value,
      rememberMe: this._form.controls.rememberMe.value,
    };
    
    this.login.emit(dto);
  }
}
```

```html
<!-- login.component.html -->
<form [formGroup]="_form" 
      [sbFormControlFirstError]="_form" 
      (ngSubmit)="submit()" 
      class="login-form">
      
  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" 
           type="email" 
           formControlName="email" 
           placeholder="Enter your email"/>
    <sb-first-error [control]="_form.controls.email"/>
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
    <input id="password" 
           type="password" 
           formControlName="password" 
           placeholder="Enter your password"/>
    <sb-first-error [control]="_form.controls.password"/>
  </div>

  <button type="submit" [disabled]="_form.invalid">
    Login
  </button>
</form>
```

## Error Message Customization

### Default Error Messages

The library provides sensible defaults for common validation errors:

| Error Key        | Example Message                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| required         | `Email is required.`                                                                                                |
| email            | `Please enter a valid email address.`                                                                               |
| minlength        | `Password must be at least 8 characters.`                                                                           |
| maxlength        | `Field must be no more than 20 characters.`                                                                         |
| pattern          | `Field format is invalid.`                                                                                          |
| min              | `Value must be at least 1.`                                                                                         |
| max              | `Value must be no more than 100.`                                                                                   |
| passwordMismatch | `Passwords do not match.`                                                                                           |
| mustMatch        | `Fields do not match.`                                                                                              |
| whitespace       | `Field cannot contain only whitespace.`                                                                             |
| forbiddenValue   | `Field cannot be "forbidden".`                                                                                      |
| asyncValidation  | `Field validation is pending...`                                                                                    |
| invalidDate      | `Please enter a valid date.`                                                                                        |
| futureDate       | `Date must be in the future.`                                                                                       |
| pastDate         | `Date must be in the past.`                                                                                         |
| strongPassword   | `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.` |
| phoneNumber      | `Please enter a valid phone number.`                                                                                |
| url              | `Please enter a valid URL.`                                                                                         |
| unique           | `This field is already taken.`                                                                                      |
| fileSize         | `File size must be less than 2MB.`                                                                                  |
| fileType         | `Only PDF, DOCX files are allowed.`                                                                                 |

> **Note:** Some messages are parameterized and will display the actual field name or value as appropriate.

### Custom Error Messages

```typescript
import { CustomErrorMessageMap } from '@spider-baby/utils-forms';

const customMessages: CustomErrorMessageMap = new Map([
  ['email', (field, error) => {
    if (error.required) return 'Email address is mandatory';
    if (error.email) return 'Please provide a valid email format';
    return '';
  }],
  ['password', (field, error) => {
    if (error.required) return 'Password cannot be empty';
    if (error.minlength) return 'Password must be at least 8 characters long';
    return '';
  }],
]);
```

```html
<form [formGroup]="myForm" 
      [sbFormControlFirstError]="myForm"
      [customErrorMessages]="customMessages">
  <!-- form controls -->
</form>
```


#### 🌎 Example: Custom Error Messages in Spanish

```typescript
import { CustomErrorMessageMap } from '@spider-baby/utils-forms';

const customMessagesEs: CustomErrorMessageMap = new Map([
  ['email', (field, error) => {
    if (error.required) return 'El correo electrónico es obligatorio';
    if (error.email) return 'Por favor, introduce un correo electrónico válido';
    return '';
  }],
  ['password', (field, error) => {
    if (error.required) return 'La contraseña no puede estar vacía';
    if (error.minlength) return 'La contraseña debe tener al menos 8 caracteres';
    return '';
  }],
]);
```

```html
<form [formGroup]="myForm" 
      [sbFormControlFirstError]="myForm"
      [customErrorMessages]="customMessagesEs">
  <!-- form controls -->
</form>
```

#### Custom Error Template

You can provide a custom error message template to `sb-first-error` using the `customErrorTemplate` input. This allows you to fully control the rendering and styling of error messages.

**Usage:**

```html
<sb-first-error [control]="form.controls.email" [customErrorTemplate]="customErrorMessageTemplate"/>

<ng-template #customErrorMessageTemplate let-errorMessage="errorMessage">
  <h3 class="custom-error">****{{errorMessage}}****</h3>
</ng-template>
```

**Inputs Table:**

| Property              | Type                        | Description                                      |
|-----------------------|-----------------------------|--------------------------------------------------|
| `control`             | `AbstractControl`           | **Required.** The form control to display errors for |
| `customErrorTemplate` | `TemplateRef<unknown>`      | Optional. Custom template for error message display |

If `customErrorTemplate` is provided, it will be used to render the error message. The template receives an `errorMessage` context variable containing the error text.

> **Limitation:**  
> Dynamic form changes (adding or removing controls at runtime) are **not automatically handled** in this version.  
> If you add or remove controls after initialization, you must manually re-run the error setup logic (e.g., by calling the directive's setup method again).  
> Support for automatic handling of dynamic form changes is planned for a future release.

## Running unit tests

Run `nx test spider-baby-utils-forms` to execute the unit tests.

## Contributing

This library is part of the Spider Baby ecosystem. For contributions:

1. Follow the established coding standards
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure accessibility compliance

## License

Part of the Spider Baby utilities collection.

---

**Built with ❤️ for better Angular forms**
