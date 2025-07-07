// Advanced usage patterns for FirstErrorDirective

export const DynamicFormExample = `// Handling dynamic forms
<form [formGroup]="form" sbFormControlFirstError>
  <ng-container *ngFor="let field of fields">
    <input [formControlName]="field" [placeholder]="field" />
    <sb-first-error [control]="form.get(field)!" />
  </ng-container>
</form>
`;

export const CustomErrorMessagesExample = `// Providing custom error messages
<form [formGroup]="form" [sbFormControlFirstError]="form" [customErrorMessages]="customMessages">
  <input formControlName="email" placeholder="Email" />
  <sb-first-error [control]="form.get('email')!" />
</form>

// In your component:
customMessages = new Map([
  ['required', (field) => \`\${field} is required!\`],
  ['email', () => 'Invalid email!']
]);
`;
