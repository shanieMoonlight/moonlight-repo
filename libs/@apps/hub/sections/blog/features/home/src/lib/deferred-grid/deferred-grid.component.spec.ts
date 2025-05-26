import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeferredGridComponent } from './deferred-grid.component';

describe('DeferredLoopComponent', () => {
  let component: DeferredGridComponent;
  let fixture: ComponentFixture<DeferredGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeferredGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeferredGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
