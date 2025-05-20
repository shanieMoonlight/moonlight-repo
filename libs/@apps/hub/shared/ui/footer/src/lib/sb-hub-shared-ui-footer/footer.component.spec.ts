import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubSharedUiFooterComponent } from './footer.component';

describe('HubSharedUiFooterComponent', () => {
  let component: HubSharedUiFooterComponent;
  let fixture: ComponentFixture<HubSharedUiFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubSharedUiFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HubSharedUiFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
