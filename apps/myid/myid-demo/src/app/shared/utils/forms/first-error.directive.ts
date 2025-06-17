import { AfterViewInit, Directive, ElementRef, inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { FormErrors } from './form-errors';


@Directive({
  selector: '[sbFormControlFirstError]',
  standalone: true
})
export class FirstErrorDirective implements OnDestroy, AfterViewInit {

  private _el = inject(ElementRef)
  private _renderer = inject(Renderer2)

  //- - - - - - - - - - - - - - //

  @Input({ required: true }) set sbFormControlFirstError(form: FormGroup) {
    this._form = form
    this.observeValueChanges(form)
  }

  //- - - - - - - - - - - - - - //

  private _form?: FormGroup
  private clickListener?: () => void
  private vcSub?: Subscription

  //----------------------------//

  ngAfterViewInit() {
    const nativeElement = this._el.nativeElement
    this.clickListener = this._renderer.listen(nativeElement, 'click', () => {
      if (this._form)
        FormErrors.setFirstErrors(this._form)
    });
  }

  //- - - - - - - - - - - - - - //

  ngOnDestroy(): void {
    this.vcSub?.unsubscribe()
    this.clickListener?.()
  }

  //----------------------------//

  observeValueChanges(form: FormGroup) {

    this.vcSub?.unsubscribe()
    this.vcSub = form.statusChanges.pipe(
      distinctUntilChanged(),
      filter(status => status === 'INVALID')
    ).subscribe(() => {
      console.log('Form status changed:', form.status);
      if (form.status === 'INVALID')
        FormErrors.setFirstErrors(form)
    })
  }

}//Cls
