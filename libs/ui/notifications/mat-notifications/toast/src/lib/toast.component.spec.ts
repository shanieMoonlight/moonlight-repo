import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbMatToastModalComponent } from './toast.component';

describe('SbMatLoaderModalComponent', () => {
  let component: SbMatToastModalComponent;
  let fixture: ComponentFixture<SbMatToastModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbMatToastModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbMatToastModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
