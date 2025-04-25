import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeSectionHdrComponent } from './section-hdr.component';

describe('SectionHdrComponent', () => {
  let component: HomeSectionHdrComponent;
  let fixture: ComponentFixture<HomeSectionHdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSectionHdrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSectionHdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
