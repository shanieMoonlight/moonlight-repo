import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbDataTableComponent } from './table.component';
import { ComponentRef } from '@angular/core';
import { BaseDataTableRowData } from './base-row-data';

describe('SbDataTableComponent', () => {
  let component: SbDataTableComponent;
  let fixture: ComponentFixture<SbDataTableComponent>;
  let componentRef: ComponentRef<SbDataTableComponent<BaseDataTableRowData>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbDataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbDataTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('columns', [])
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
