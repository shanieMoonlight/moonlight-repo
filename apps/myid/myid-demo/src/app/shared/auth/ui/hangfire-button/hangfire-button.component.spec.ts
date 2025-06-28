import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbToastService } from '@spider-baby/ui-toast';
import { MyIdAuthService } from '../../services/auth/myid-auth.browser.service';
import { HangfireButtonComponent } from './hangfire-button.component';

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

describe('HangfireButtonComponent', () => {
  let component: HangfireButtonComponent;
  let fixture: ComponentFixture<HangfireButtonComponent>;
  let componentRef: ComponentRef<HangfireButtonComponent>;
  let authService: MockAuthService;
  let toastService: MockToastService;
  let windowOpenSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangfireButtonComponent],
      providers: [
        { provide: MyIdAuthService, useClass: MockAuthService },
        { provide: SbToastService, useClass: MockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HangfireButtonComponent);
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

  it('should call goToSwagger when button is clicked', () => {
    const goToSwaggerSpy = jest.spyOn(component as unknown as { goToSwagger: () => void }, 'goToSwagger');
    const btn = fixture.debugElement.query(By.css('sb-icon-button'));
    btn.triggerEventHandler('click');
    expect(goToSwaggerSpy).toHaveBeenCalled();
  });

  it('should open window with correct URL and options', () => {
    componentRef.setInput('hangfirePath', '/custom-hangfire');
    authService.accessToken.mockReturnValue('abc123');
    fixture.detectChanges();
    (component as unknown as { goToSwagger: () => void }).goToSwagger();
    expect(windowOpenSpy).toHaveBeenCalledWith('https://localhost:12312/custom-hangfire?tkn=abc123', '_blank', 'noopener,noreferrer');
  });

  it('should show warning toast if no access token', () => {
    authService.accessToken.mockReturnValue(undefined);
    (component as unknown as { goToSwagger: () => void }).goToSwagger();
    expect(toastService.warning).toHaveBeenCalledWith('You must be logged in to access Swagger');
  });

  it('should bind inputs correctly', () => {
    componentRef.setInput('hangfirePath', '/another-path');
    componentRef.setInput('color', 'tertiary');
    componentRef.setInput('showTooltip', false);
    componentRef.setInput('hangfireIconSvg', 'svg-data');
    fixture.detectChanges();
    expect(component.hangfirePath()).toBe('/another-path');
    expect(component.color()).toBe('tertiary');
    expect(component.showTooltip()).toBe(false);
    expect(component.hangfireIconSvg()).toBe('svg-data');
  });
});
