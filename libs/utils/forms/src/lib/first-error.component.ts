import { NgTemplateOutlet } from '@angular/common';
import { Component, input, TemplateRef } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: 'sb-first-error',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
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
  `,
  styles: [`
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
  `]
})
export class FirstErrorComponent {

  control = input.required<AbstractControl>();
  customErrorTemplate = input<TemplateRef<unknown> | undefined>(undefined)

}