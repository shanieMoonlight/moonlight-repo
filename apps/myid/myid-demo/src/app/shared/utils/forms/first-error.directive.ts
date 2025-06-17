import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FromErrors } from './form-errors';

@Directive({
  selector: '[sbFormControlFirstError]',
  standalone: true
})
export class FirstErrorDirective implements OnDestroy, AfterViewInit {

  private _el = inject(ElementRef)
  private _renderer = inject(Renderer2)

  //- - - - - - - - - - - - - - - - - - - -//

  @Input({ required: true }) set sbFormControlFirstError(form: FormGroup) {
    this._form = form
    this.observeValueChanges(form)
  }

  //- - - - - - - - - - - - - - - - - - - -//
  
  private _form?: FormGroup
  private clickListener?: () => void
  private vcSub?: Subscription

  //----------------------------//

  ngAfterViewInit() {
    const nativeElement = this._el.nativeElement
    this.clickListener = this._renderer.listen(nativeElement, 'click', () => {
      if (this._form)
        FromErrors.setFirstErrors(this._form)
    });
  }

  //- - - - - - - - - - - - - - - - - - - -//

  ngOnDestroy(): void {
    this.vcSub?.unsubscribe()
    this.clickListener?.()
  }

  //----------------------------//

  observeValueChanges(form: FormGroup) {
    
    this.vcSub?.unsubscribe()
    this.vcSub = form.valueChanges.subscribe(
      () => FromErrors.setFirstErrors(form)
    )
  }

  //----------------------------//

}//Cls
