// Code samples for FirstErrorDirective and FirstErrorComponent tutorial

export const BasicFirstErrorExample = `// Basic usage of FirstErrorDirective and FirstErrorComponent
<form [formGroup]="form" sbFormControlFirstError>
  <input formControlName="email" placeholder="Email" />
  <sb-first-error [control]="form.get('email')!" />
  <button type="submit">Submit</button>
</form>
`;

export const CustomErrorTemplateExample = `// Using a custom error template
<form [formGroup]="form" sbFormControlFirstError>
  <input formControlName="password" placeholder="Password" />
  <ng-template #customError let-errorMessage="errorMessage">
    <span class="custom-error">Custom: {{errorMessage}}</span>
  </ng-template>
  <sb-first-error [control]="form.get('password')!" [customErrorTemplate]="customError" />
</form>
`;

export const ShowUntouchedExample = `// Showing errors for untouched controls
<form [formGroup]="form" [sbFormControlFirstError]="form" [showUntouched]="true">
  <input formControlName="username" placeholder="Username" />
  <sb-first-error [control]="form.get('username')!" />
</form>
`;
