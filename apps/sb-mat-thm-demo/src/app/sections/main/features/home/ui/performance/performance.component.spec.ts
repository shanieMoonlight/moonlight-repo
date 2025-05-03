import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePerformanceComponent } from './performance.component';

describe('PerformanceComponent', () => {
  let component: HomePerformanceComponent;
  let fixture: ComponentFixture<HomePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePerformanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePerformanceComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sectionNumber', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
