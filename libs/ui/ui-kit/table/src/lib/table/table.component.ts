import { ChangeDetectionStrategy, Component, Input, input, output, signal } from '@angular/core';
import { SbButtonComponent, SbButtonIconCloseComponent, SbIconButtonComponent, SbButtonIconAddComponent } from '@spider-baby/ui-kit/buttons';
import { SbCheckboxComponent } from '@spider-baby/ui-kit/checkboxes';
import { SbSelectComponent } from '@spider-baby/ui-kit/select';
import { ColumnData } from './column';
import { SbDataTableRowData } from './table-row-data';
import { CommonModule } from '@angular/common';
import { BaseDataTableRowData } from './base-row-data';
import { SbDataTableCellComponent } from './table-cell/table-cell.component';
import { SbTableHeaderCellComponent } from './table-header-cell/table-header-cell.component';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';

@Component({
  selector: 'sb-data-table',
  standalone: true,
  imports: [
    CommonModule,
    SbButtonComponent,
    SbButtonIconCloseComponent,
    SbIconButtonComponent,
    SbSelectComponent,
    SbCheckboxComponent,
    SbDataTableCellComponent,
    SbTableHeaderCellComponent,
    SbButtonIconAddComponent,
    SbTooltipDirective
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'color()',
    '[class.row-clickable]': 'rowClickable()',
  },
})
export class SbDataTableComponent<T extends BaseDataTableRowData = BaseDataTableRowData> {


  columns = input.required<ColumnData<T>[]>();

  protected _data = signal<T[]>([]);
  /** What to display. Default = [] */
  @Input('data') set data(array: T[] | undefined | null) {
    this._data.set(array ?? []);
    console.log('DataTable data set:', this._data());
  }
  rowClickable = input(true);

  // Example output for row click (can add more as needed)
  rowClick = output<SbDataTableRowData<T>>();
  addItem = output<void>();

  /** Mat Color theme. Default = 'primary  */
  color = input<UiKitTheme>('primary')


  //------------------------//


  protected onRowClick = (row: T, index: number) => this.rowClick.emit({ row, index });
  protected onAddItem =() => this.addItem.emit();


}
