import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDemoCombinedComponent } from './combined.component';

describe('MainDemoCombinedComponent', () => {
  let component: MainDemoCombinedComponent;
  let fixture: ComponentFixture<MainDemoCombinedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDemoCombinedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDemoCombinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
