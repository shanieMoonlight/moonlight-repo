import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbDataTableComponent } from './table.component';

describe('SbDataTableComponent', () => {
  let component: SbDataTableComponent;
  let fixture: ComponentFixture<SbDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbDataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
