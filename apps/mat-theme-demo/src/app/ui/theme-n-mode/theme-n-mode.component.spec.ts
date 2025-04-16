import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeNModeComponent } from './theme-n-mode.component';

describe('ThemeNModeComponent', () => {
  let component: ThemeNModeComponent;
  let fixture: ComponentFixture<ThemeNModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeNModeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeNModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
