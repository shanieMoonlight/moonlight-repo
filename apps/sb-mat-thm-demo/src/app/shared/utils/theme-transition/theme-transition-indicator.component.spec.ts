import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTransitionIndicatorComponent } from './theme-transition-indicator.component';

describe('ThemeTransitionIndicatorComponent', () => {
  let component: ThemeTransitionIndicatorComponent;
  let fixture: ComponentFixture<ThemeTransitionIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeTransitionIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeTransitionIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
