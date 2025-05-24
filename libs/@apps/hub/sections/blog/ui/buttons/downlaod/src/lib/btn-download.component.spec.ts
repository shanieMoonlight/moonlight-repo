import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubUiBtnDownloadComponent } from './btn-download.component';

describe('HubUiBtnDownloadComponent', () => {
  let component: HubUiBtnDownloadComponent;
  let fixture: ComponentFixture<HubUiBtnDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubUiBtnDownloadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HubUiBtnDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
