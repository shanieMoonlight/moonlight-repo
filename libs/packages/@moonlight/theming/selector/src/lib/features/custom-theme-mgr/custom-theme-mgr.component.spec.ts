import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomThemeMgrComponent } from './custom-theme-mgr.component';

describe('CustomThemeMgrComponent', () => {
  let component: CustomThemeMgrComponent;
  let fixture: ComponentFixture<CustomThemeMgrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomThemeMgrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomThemeMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
