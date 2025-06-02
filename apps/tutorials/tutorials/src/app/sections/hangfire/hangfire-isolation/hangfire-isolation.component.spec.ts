import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HangfireIsolationComponent } from './hangfire-isolation.component';

describe('HangfireIsolationComponent', () => {
  let component: HangfireIsolationComponent;
  let fixture: ComponentFixture<HangfireIsolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangfireIsolationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HangfireIsolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
