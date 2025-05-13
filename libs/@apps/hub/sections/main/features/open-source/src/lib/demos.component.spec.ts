import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubOpenSourceDemosComponent } from './demos.component';

describe('OpenSourceDemosComponent', () => {
  let component: HubOpenSourceDemosComponent;
  let fixture: ComponentFixture<HubOpenSourceDemosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubOpenSourceDemosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HubOpenSourceDemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
