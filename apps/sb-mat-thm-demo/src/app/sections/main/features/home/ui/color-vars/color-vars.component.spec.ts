import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeColorVarsComponent } from './color-vars.component';

describe('PerformanceComponent', () => {
  let component: HomeColorVarsComponent;
  let fixture: ComponentFixture<HomeColorVarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeColorVarsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeColorVarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
