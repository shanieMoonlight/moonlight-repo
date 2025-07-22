// Code samples for FirstErrorDirective and FirstErrorComponent tutorial

export const BasicFirstErrorHtmlCode = `// Basic usage of FirstErrorDirective and FirstErrorComponent
<form [formGroup]="form" [sbFormControlFirstError]="form">

    <input formControlName="email" placeholder="Email" />
    <sb-first-error [control]="_form.get('email')!" />
  
    <button type="submit">Submit</button>

</form>
`;

export const CustomErrorTemplateHtmlCode = `// Using a custom error template
<form [formGroup]="form"  [sbFormControlFirstError]="form">

  <input formControlName="password" placeholder="Password" />
  <sb-first-error [control]="form.get('password')!" [customErrorTemplate]="customError" />
  
</form>

<ng-template #customError let-errorMessage="errorMessage">
<span class="custom-error">Custom: {{errorMessage}}</span>
</ng-template>
`;

export const ShowUntouchedHtmlCode = `// Showing errors for untouched controls
<form [formGroup]="form" [sbFormControlFirstError]="form" [showUntouched]="true">

  <input formControlName="username" placeholder="Username" />
  <sb-first-error [control]="form.get('username')!" />

</form>
`;
