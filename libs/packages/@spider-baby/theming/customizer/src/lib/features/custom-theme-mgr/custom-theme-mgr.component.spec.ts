import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbCustomThemeManagerComponent  } from './custom-theme-mgr.component';

describe('CustomThemeMgrComponent', () => {
  let component: SbCustomThemeManagerComponent ;
  let fixture: ComponentFixture<SbCustomThemeManagerComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbCustomThemeManagerComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(SbCustomThemeManagerComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
