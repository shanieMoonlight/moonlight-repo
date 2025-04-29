import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDemoCrudComponent } from './crud.component';

describe('ManualCrudComponent', () => {
  let component: MainDemoCrudComponent;
  let fixture: ComponentFixture<MainDemoCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDemoCrudComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDemoCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
