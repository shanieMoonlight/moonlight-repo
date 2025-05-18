import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';

@Component({
  selector: 'rd-app-structure-diagram',
  imports: [
    MatEverythingModule,
    NgTemplateOutlet,
    CommonModule
  ],
  templateUrl: './app-structure-diagram.component.html',
  styleUrl: './app-structure-diagram.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppStructureDiagramComponent {


  _swapRoutes = input(true, { alias: 'swapRoutes' });


  private _adminRoutesInitial = signal(['home', 'other-routes...'])
  private _productRoutesInitial = signal(['home', 'other-routes...'])

  protected _mainRoutes = signal(['home', 'products']);
  protected _productAdminRoutes = signal(['home', 'new-product'])


  protected _adminRoutes = computed(() =>
    this._swapRoutes()
      ? this._adminRoutesInitial()
      : [...this._adminRoutesInitial(), 'products']
  );
  protected _productRoutes = computed(() =>
    !this._swapRoutes()
      ? this._productRoutesInitial()
      : [...this._productRoutesInitial(), 'admin']
  );
}
