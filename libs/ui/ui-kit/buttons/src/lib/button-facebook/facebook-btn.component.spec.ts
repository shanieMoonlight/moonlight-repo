import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbButtonFacebookComponent } from './facebook-btn.component';

describe('FacebookButtonComponent', () => {
  let component: SbButtonFacebookComponent;
  let fixture: ComponentFixture<SbButtonFacebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbButtonFacebookComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbButtonFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
