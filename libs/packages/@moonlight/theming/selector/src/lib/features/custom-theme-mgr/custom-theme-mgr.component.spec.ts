import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MlCustomThemeManagerComponent  } from './custom-theme-mgr.component';

describe('CustomThemeMgrComponent', () => {
  let component: MlCustomThemeManagerComponent ;
  let fixture: ComponentFixture<MlCustomThemeManagerComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlCustomThemeManagerComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(MlCustomThemeManagerComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
