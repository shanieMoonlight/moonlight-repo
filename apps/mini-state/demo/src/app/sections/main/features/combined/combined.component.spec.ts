import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualCrudComponent } from './combined.component';

describe('ManualCrudComponent', () => {
  let component: ManualCrudComponent;
  let fixture: ComponentFixture<ManualCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualCrudComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
