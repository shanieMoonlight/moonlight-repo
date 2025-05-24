import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbPortalInputComponent } from './portal-input.component';

describe('NavPortalComponent', () => {
  let component: SbPortalInputComponent;
  let fixture: ComponentFixture<SbPortalInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbPortalInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbPortalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
