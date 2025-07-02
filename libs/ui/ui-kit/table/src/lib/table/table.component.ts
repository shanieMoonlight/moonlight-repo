import { ChangeDetectionStrategy, Component, Input, input, output, signal } from '@angular/core';
import { SbButtonIconAddComponent } from '@spider-baby/ui-kit/buttons';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { BaseDataTableRowData } from './base-row-data';
import { ColumnData } from './column';
import { SbDataTableCellComponent } from './table-cell/table-cell.component';
import { SbTableHeaderCellComponent } from './table-header-cell/table-header-cell.component';
import { SbDataTableRowData } from './table-row-data';
import { ActionEvent } from './table-cell/action-event';
import { SbProgressBarComponent } from '@spider-baby/ui-kit/progress-bar';

@Component({
  selector: 'sb-data-table',
  standalone: true,
  imports: [
    SbDataTableCellComponent,
    SbTableHeaderCellComponent,
    SbButtonIconAddComponent,
    SbTooltipDirective,
    SbProgressBarComponent
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
  }
  rowClickable = input(true);
  canAddItem = input<boolean>(true);
  addItemTooltip = input('Add Item');

  /** Mat Color theme. Default = 'primary  */
  color = input<UiKitTheme>('primary')
  loading = input<boolean>(false)


  // Example output for row click (can add more as needed)
  rowClick = output<SbDataTableRowData<T>>();
  addItem = output<void>();
  action = output<ActionEvent<T>>();


  //------------------------//


  protected onRowClick = (row: T, index: number) =>
    this.rowClickable() && this.rowClick.emit({ element: row, index });

  protected onAddItemClick = () =>
    this.addItem.emit();

  protected onActionClick = (actEv: ActionEvent<T>, rowIdx: number) =>
    this.action.emit(actEv.setRowIdx(rowIdx));


}
