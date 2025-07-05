import { ApplicationRef, Injectable, Injector, createComponent } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { ConfirmModalComponent } from './confirm-modal.component';

@Injectable({ providedIn: 'root' })
export class ConfirmModalService {

    
    constructor(
        private _appRef: ApplicationRef,
        private _injector: Injector
    ) { }

    //- - - - - - - - - - - -//

    open(title: string, description: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.createModal(title, description, resolve);
        });
    }

    open$(title: string, description: string): Observable<boolean> {
        const confirm$ = new Subject<boolean>();
        this.createModal(title, description, (result) => confirm$.next(result));
        return confirm$.pipe(take(1));
    }

    //- - - - - - - - - - - -//

    private createModal(
        title: string,
        description: string,
        onResult: (result: boolean) => void
    ): void {
        const componentRef = createComponent(ConfirmModalComponent, {
            environmentInjector: this._appRef.injector,
            elementInjector: this._injector,
        });

        componentRef.setInput('title', title);
        componentRef.setInput('description', description);
        componentRef.setInput('openModal', true);

        const sub = componentRef.instance.confirm.subscribe((result: boolean) => {
            onResult(result);
            sub.unsubscribe();
            this._appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        });

        this._appRef.attachView(componentRef.hostView);
        document.body.appendChild((componentRef.hostView as any).rootNodes[0]);
    }

}//Cls