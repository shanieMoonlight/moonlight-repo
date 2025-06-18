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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sbFormControlFirstError` | `FormGroup` | **required** | The reactive form to monitor |
| `customErrorMessages` | `CustomErrorMessageMap` | `undefined` | Custom error message mappings |
| `showUntouched` | `boolean` | `false` | Show errors before user interaction |

### 🎨 FirstErrorComponent

A standalone component that displays validation errors with smooth animations and accessibility features.

**Selector:** `sb-first-error`

#### Features
- Displays only the first validation error
- Smooth fade-in animation for error appearance
- ARIA live regions for screen reader compatibility
- CSS custom properties for theme integration

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

| Property | Type | Description |
|----------|------|-------------|
| `control` | `AbstractControl` | **Required.** The form control to display errors for |

## Installation & Setup

### 1. Import the Library

```typescript
import { 
  FirstErrorDirective, 
  FirstErrorComponent 
} from '@spider-baby-repo/utils-forms';

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

| Error Key         | Example Message                                                                 |
|-------------------|-------------------------------------------------------------------------------|
| required          | `Email is required.`                                                           |
| email             | `Please enter a valid email address.`                                          |
| minlength         | `Password must be at least 8 characters.`                                      |
| maxlength         | `Field must be no more than 20 characters.`                                    |
| pattern           | `Field format is invalid.`                                                     |
| min               | `Value must be at least 1.`                                                    |
| max               | `Value must be no more than 100.`                                              |
| passwordMismatch  | `Passwords do not match.`                                                      |
| mustMatch         | `Fields do not match.`                                                         |
| whitespace        | `Field cannot contain only whitespace.`                                        |
| forbiddenValue    | `Field cannot be "forbidden".`                                               |
| asyncValidation   | `Field validation is pending...`                                               |
| invalidDate       | `Please enter a valid date.`                                                   |
| futureDate        | `Date must be in the future.`                                                  |
| pastDate          | `Date must be in the past.`                                                    |
| strongPassword    | `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.` |
| phoneNumber       | `Please enter a valid phone number.`                                           |
| url               | `Please enter a valid URL.`                                                    |
| unique            | `This field is already taken.`                                                 |
| fileSize          | `File size must be less than 2MB.`                                             |
| fileType          | `Only PDF, DOCX files are allowed.`                                            |

> **Note:** Some messages are parameterized and will display the actual field name or value as appropriate.

### Custom Error Messages

```typescript
import { CustomErrorMessageMap } from '@spider-baby-repo/utils-forms';

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

## Accessibility Features

- **ARIA Live Regions**: Error messages are announced to screen readers
- **Role Attributes**: Proper semantic roles for assistive technology
- **Focus Management**: Works seamlessly with keyboard navigation
- **Progressive Enhancement**: Graceful fallback without JavaScript

## Browser Support

- **Angular**: 15+ (Standalone Components)
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Accessibility**: WCAG 2.1 AA compliant

## Best Practices

### 1. Form Structure
```html
<!-- ✅ Good: Clear hierarchy and error placement -->
<div class="form-group">
  <label for="field">Field Label</label>
  <input id="field" formControlName="field" />
  <sb-first-error [control]="form.controls.field"/>
</div>
```

### 2. Validation Strategy
```typescript
// ✅ Good: Meaningful validation rules
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required, Validators.minLength(8)]],
```

### 3. User Experience
- Use meaningful placeholder text
- Provide clear validation requirements
- Consider progressive disclosure for complex forms
- Test with screen readers

## Integration with Other Libraries

### Material Design
Works seamlessly with Angular Material:

```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput formControlName="email" />
  <sb-first-error [control]="form.controls.email"/>
</mat-form-field>
```

### Bootstrap
Compatible with Bootstrap form classes:

```html
<div class="mb-3">
  <label class="form-label">Email</label>
  <input class="form-control" formControlName="email" />
  <sb-first-error [control]="form.controls.email"/>
</div>
```

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
