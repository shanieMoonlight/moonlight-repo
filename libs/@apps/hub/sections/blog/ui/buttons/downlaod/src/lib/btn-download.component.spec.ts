import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnDownloadComponent } from './btn-download.component';

describe('BtnDownloadComponent', () => {
  let component: BtnDownloadComponent;
  let fixture: ComponentFixture<BtnDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnDownloadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
