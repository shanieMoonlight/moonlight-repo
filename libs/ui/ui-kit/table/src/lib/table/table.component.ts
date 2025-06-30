import { ChangeDetectionStrategy, Component, Input, input, output, signal } from '@angular/core';
import { SbButtonIconAddComponent } from '@spider-baby/ui-kit/buttons';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { BaseDataTableRowData } from './base-row-data';
import { ColumnData } from './column';
import { SbDataTableCellComponent } from './table-cell/table-cell.component';
import { SbTableHeaderCellComponent } from './table-header-cell/table-header-cell.component';
import { SbDataTableRowData } from './table-row-data';

@Component({
  selector: 'sb-data-table',
  standalone: true,
  imports: [
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
