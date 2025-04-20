import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MlThemeShowcaseMatComponent } from './theme-showcase-mat.component';


describe('ThemeShowcaseMatComponent', () => {
  let component: MlThemeShowcaseMatComponent;
  let fixture: ComponentFixture<MlThemeShowcaseMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlThemeShowcaseMatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlThemeShowcaseMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
