import { NgTemplateOutlet } from '@angular/common';
import { Component, input, TemplateRef } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'sb-first-error-mat',
  standalone: true,
  imports: [NgTemplateOutlet, MatFormFieldModule],
  template: `
    @if(control().errors?.['firstError']; as err) {
       @if(customErrorTemplate(); as template){
         <ng-container 
          [ngTemplateOutlet]="template" 
          [ngTemplateOutletContext]="{errorMessage: err}"/>
        }@else {
          <mat-error>{{err}}</mat-error>
        }
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FirstErrorMatComponent {

  control = input.required<AbstractControl>();
  customErrorTemplate = input<TemplateRef<unknown> | undefined>(undefined)

}