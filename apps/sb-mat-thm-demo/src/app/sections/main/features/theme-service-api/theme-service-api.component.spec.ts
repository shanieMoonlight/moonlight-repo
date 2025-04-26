import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeServiceApiComponent } from './theme-service-api.component';

describe('ThemeServiceApiComponent', () => {
  let component: ThemeServiceApiComponent;
  let fixture: ComponentFixture<ThemeServiceApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeServiceApiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeServiceApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
