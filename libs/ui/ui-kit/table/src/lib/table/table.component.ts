import { ChangeDetectionStrategy, Component, Input, input, output, signal } from '@angular/core';
import { SbButtonComponent, SbButtonIconCloseComponent, SbIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbCheckboxComponent } from '@spider-baby/ui-kit/checkboxes';
import { SbSelectComponent } from '@spider-baby/ui-kit/select';
import { ColumnData } from './column';
import { SbDataTableRowData } from './table-row-data';
import { CommonModule } from '@angular/common';
import { BaseDataTableRowDtata as BaseDataTableRowData } from './base-row-data';
import { SbDataTableCellComponent } from './table-cell/table-cell.component';
import { SbTableHeaderCellComponent } from './table-header-cell/table-header-cell.component';
import { UiKitTheme } from '@spider-baby/ui-kit/types';

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
    SbTableHeaderCellComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'color()',
  },
})
export class SbDataTableComponent<T extends BaseDataTableRowData = BaseDataTableRowData> {

  columns = input.required<ColumnData[]>();

  protected _data = signal<T[]>([]);
  /** What to display. Default = [] */
  @Input('data') set data(array: T[] | undefined | null) {
    this._data.set(array ?? []);
    console.log('DataTable data set:', this._data());
  }

  // Example output for row click (can add more as needed)
  rowClick = output<SbDataTableRowData<T>>();

  /** Mat Color theme. Default = 'primary  */
  color = input<UiKitTheme>('primary')


  //------------------------//


  protected onRowClick = (row: T, index: number) => this.rowClick.emit({ row, index });


}
