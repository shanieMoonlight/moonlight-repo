import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomThemeSavedComponent } from './theme-saved.component';

describe('CustomThemeSavedComponent', () => {
  let component: CustomThemeSavedComponent;
  let fixture: ComponentFixture<CustomThemeSavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomThemeSavedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomThemeSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
