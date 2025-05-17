import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpiderBabyHubEntryPointComponent } from './spider-baby-hub-entry-point.component';

describe('SpiderBabyHubEntryPointComponent', () => {
  let component: SpiderBabyHubEntryPointComponent;
  let fixture: ComponentFixture<SpiderBabyHubEntryPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpiderBabyHubEntryPointComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpiderBabyHubEntryPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
