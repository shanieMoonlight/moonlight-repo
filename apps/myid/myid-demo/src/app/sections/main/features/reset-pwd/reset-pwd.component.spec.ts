/* eslint-disable @typescript-eslint/no-explicit-any */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { SbMatNotificationsModalComponent } from '@spider-baby/ui-mat-notifications';
import { of } from 'rxjs';
import { SbResetPwdFormComponent } from '../../../../shared/id/ui/forms/reset-pwd/reset-pwd.component';
import { ResetPwdComponent } from './reset-pwd.component';
import { ResetPwdStateService } from './reset-pwd.state.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

// Mock the state service
class MockResetPwdStateService {
  successMsg = signal('success');
  errorMsg = signal('error');
  loading = signal(false);
  readyToReset = signal(true);
  resetPwd = jest.fn();
}

const mockActivatedRoute = {
  queryParamMap: of(new Map([
    ['userId', '123'],
    ['resetToken', 'abc123']
  ])),
  params: of({ id: '123' }),
  queryParams: of({ userId: '123', resetToken: 'abc123' }),
};

describe('ResetPwdComponent', () => {
  let component: ResetPwdComponent;
  let fixture: ComponentFixture<ResetPwdComponent>;
  let stateService: MockResetPwdStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        provideHttpClientTesting(),
        provideHttpClient(),
        ResetPwdComponent,
        SbMatNotificationsModalComponent,
        SbResetPwdFormComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ResetPwdStateService, useClass: MockResetPwdStateService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ResetPwdComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(ResetPwdStateService) as any as (MockResetPwdStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose state properties from the service', () => {
    expect(component['_successMsg']).toBe('success');
    expect(component['_errorMsg']).toBe('error');
    expect(component['_loading']).toBe(false);
    expect(component['_readyToReset']).toBe(true);
  });

  it('should call state.resetPwd when resetPwd is called', () => {
    const dto = { newPassword: 'abc', confirmPassword: 'abc' };
    component.resetPwd(dto as any);
    expect(stateService.resetPwd).toHaveBeenCalledWith(dto);
  });
});
