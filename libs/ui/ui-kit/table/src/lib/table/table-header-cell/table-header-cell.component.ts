import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { CamelToTitlePipe } from '../../utils/camelcase-to-titlecase.pipe';
import { ColumnData } from '../column';
import { BaseDataTableRowData } from '../base-row-data';

@Component({
  selector: 'sb-table-header-cell',
  imports: [CamelToTitlePipe],
  standalone: true,
  templateUrl: './table-header-cell.component.html',
  styleUrl: './table-header-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
     host: {
        '[class]': 'color()',
    },
})
export class SbTableHeaderCellComponent<T extends BaseDataTableRowData> {

  
  /** The column to be filtered */
  column = input.required<ColumnData<T>>()

  /** Mat Color theme. Default = 'primary  */
  color = input<UiKitTheme>('primary')
}
