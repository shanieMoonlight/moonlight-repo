import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbPortalOutletComponent } from './portal-outlet.component';

describe('SbPortalOutletComponent', () => {
  let component: SbPortalOutletComponent;
  let fixture: ComponentFixture<SbPortalOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbPortalOutletComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbPortalOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
