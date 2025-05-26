import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbHubDeferredGridComponent } from './deferred-grid.component';

describe('DeferredLoopComponent', () => {
  let component: SbHubDeferredGridComponent;
  let fixture: ComponentFixture<SbHubDeferredGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbHubDeferredGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SbHubDeferredGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
