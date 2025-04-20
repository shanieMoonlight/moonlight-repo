import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MlCustomThemeMgrComponent } from './custom-theme-mgr.component';

describe('CustomThemeMgrComponent', () => {
  let component: MlCustomThemeMgrComponent;
  let fixture: ComponentFixture<MlCustomThemeMgrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlCustomThemeMgrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MlCustomThemeMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
