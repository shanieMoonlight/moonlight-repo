import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDemoCustomizationComponent as MainDemoCustomizationComponent } from './customization.component';

describe('ThemingComponent', () => {
  let component: MainDemoCustomizationComponent;
  let fixture: ComponentFixture<MainDemoCustomizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDemoCustomizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDemoCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
