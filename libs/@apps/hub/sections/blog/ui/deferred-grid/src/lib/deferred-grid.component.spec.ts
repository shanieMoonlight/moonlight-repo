import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SbHubDeferredGridComponent } from './deferred-grid.component';

describe('DeferredLoopComponent', () => {
  let component: SbHubDeferredGridComponent<any>;
  let fixture: ComponentFixture<SbHubDeferredGridComponent<any>>;

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
