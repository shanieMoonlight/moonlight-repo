import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LightDarkToggleComponent } from './light-dark-toggle.component';

describe('LightDarkToggleComponent', () => {
  let component: LightDarkToggleComponent;
  let fixture: ComponentFixture<LightDarkToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightDarkToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LightDarkToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
