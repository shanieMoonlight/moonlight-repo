import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubBlogFirstErrorComponent } from './first-error.component';

describe('HubBlogFirstErrorComponent', () => {
  let component: HubBlogFirstErrorComponent;
  let fixture: ComponentFixture<HubBlogFirstErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubBlogFirstErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HubBlogFirstErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
