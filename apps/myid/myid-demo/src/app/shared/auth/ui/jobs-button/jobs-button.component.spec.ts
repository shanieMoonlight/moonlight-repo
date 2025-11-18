import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbToastService } from '@spider-baby/ui-toast';
import { MyIdAuthService } from '@spider-baby/myid-auth/services';
import { JobsButtonComponent } from './jobs-button.component';

// Mock services
class MockAuthService {
  accessToken = jest.fn().mockReturnValue('mock-token');
}
class MockToastService {
  warning = jest.fn();
}

jest.mock('../../../../../environments/environment', () => ({
  environment: {
    serverBaseUrl: 'https://localhost:12312'
  }
}));

describe('JobsButtonComponent', () => {
  let component: JobsButtonComponent;
  let fixture: ComponentFixture<JobsButtonComponent>;
  let componentRef: ComponentRef<JobsButtonComponent>;
  let authService: MockAuthService;
  let toastService: MockToastService;
  let windowOpenSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsButtonComponent],
      providers: [
        { provide: MyIdAuthService, useClass: MockAuthService },
        { provide: SbToastService, useClass: MockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobsButtonComponent);
    componentRef = fixture.componentRef;
    component = fixture.componentInstance;
    authService = TestBed.inject(MyIdAuthService) as any;
    toastService = TestBed.inject(SbToastService) as any;
    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation();
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call goToJobsDashboard when button is clicked', () => {
    const goToJobsDashboardSpy = jest.spyOn(component as unknown as { goToJobsDashboard: () => void }, 'goToJobsDashboard');
    const btn = fixture.debugElement.query(By.css('sb-icon-button'));
    btn.triggerEventHandler('click');
    expect(goToJobsDashboardSpy).toHaveBeenCalled();
  });

  it('should open window with correct URL and options', () => {
    componentRef.setInput('jobsPath', '/custom-jobs');
    authService.accessToken.mockReturnValue('abc123');
    fixture.detectChanges();
    (component as unknown as { goToJobsDashboard: () => void }).goToJobsDashboard();
    expect(windowOpenSpy).toHaveBeenCalledWith('https://localhost:12312/custom-jobs?tkn=abc123', '_blank', 'noopener,noreferrer');
  });

  it('should show warning toast if no access token', () => {
    authService.accessToken.mockReturnValue(undefined);
    (component as unknown as { goToJobsDashboard: () => void }).goToJobsDashboard();
    expect(toastService.warning).toHaveBeenCalledWith('You must be logged in to access Jobs Dashboard');
  });

  it('should bind inputs correctly', () => {
    componentRef.setInput('jobsPath', '/another-path');
    componentRef.setInput('color', 'tertiary');
    componentRef.setInput('showTooltip', false);
    componentRef.setInput('jobsIconSvg', 'svg-data');
    fixture.detectChanges();
    expect(component.jobsPath()).toBe('/another-path');
    expect(component.color()).toBe('tertiary');
    expect(component.showTooltip()).toBe(false);
    expect(component.jobsIconSvg()).toBe('svg-data');
  });
});
