import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbTableHeaderCellComponent } from './table-header-cell.component';
import { BaseDataTableRowData } from '../base-row-data';
import { ComponentRef } from '@angular/core';
import { ColumnData } from '../column';


const mockColumn:Partial<ColumnData<BaseDataTableRowData>> = {

  name: 'testColumn',
  filterDataType: 'string',
  handleNestedProperty: (x) => x,
  actionTableCell: undefined
}


describe('SbTableHeaderCellComponent', () => {
  let component: SbTableHeaderCellComponent<BaseDataTableRowData>;
  let fixture: ComponentFixture<SbTableHeaderCellComponent<BaseDataTableRowData>>;
  let componentRef: ComponentRef<SbTableHeaderCellComponent<BaseDataTableRowData>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbTableHeaderCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbTableHeaderCellComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('column', mockColumn)
    fixture.detectChanges();
  });

  it('should create', () => {
    componentRef.setInput('column', mockColumn)
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
