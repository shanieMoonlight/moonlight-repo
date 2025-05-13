import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubOpenSourceDemoCardComponent } from './demo-card.component';

describe('OpenSourceDemoCardComponent', () => {
  let component: HubOpenSourceDemoCardComponent;
  let fixture: ComponentFixture<HubOpenSourceDemoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubOpenSourceDemoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HubOpenSourceDemoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
