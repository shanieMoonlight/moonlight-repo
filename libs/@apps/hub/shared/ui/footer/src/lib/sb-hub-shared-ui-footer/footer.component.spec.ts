import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbHubSharedUiFooterComponent } from './footer.component';

describe('SbHubSharedUiFooterComponent', () => {
  let component: SbHubSharedUiFooterComponent;
  let fixture: ComponentFixture<SbHubSharedUiFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbHubSharedUiFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbHubSharedUiFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
