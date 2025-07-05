import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MyIdRouteInfo } from '@spider-baby/myid-auth/utils';
import { AccountIoService } from '@spider-baby/myid-io';
import { MessageResponseDto, ResetPwdDto } from '@spider-baby/myid-io/models';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ResetPwdStateService } from './reset-pwd.state.service';

describe('ResetPwdStateService', () => {
  let service: ResetPwdStateService;
  let mockAccountIoService: Partial<AccountIoService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let queryParamMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(() => {
    // Create Jest mock objects - only mock the methods we need
    mockAccountIoService = {
      resetPassword: jest.fn()
    };

    // Setup ActivatedRoute mock with queryParamMap as BehaviorSubject
    queryParamMapSubject = new BehaviorSubject(convertToParamMap({}));
    mockActivatedRoute = {
      queryParamMap: queryParamMapSubject.asObservable()
    };

    TestBed.configureTestingModule({
      providers: [
        ResetPwdStateService,
        { provide: AccountIoService, useValue: mockAccountIoService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    service = TestBed.inject(ResetPwdStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('readyToReset', () => {
    it('should return false when no query params are present', () => {
      // Initial state - no params
      expect(service.readyToReset()).toBeFalsy();
    });

    it('should return false when only userId is present', () => {
      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'test-user-id'
      }));

      expect(service.readyToReset()).toBeFalsy();
    });

    it('should return false when only reset token is present', () => {
      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'test-token'
      }));

      expect(service.readyToReset()).toBeFalsy();
    });

    it('should return true when both userId and reset token are present', () => {
      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'test-user-id',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'test-token'
      }));

      expect(service.readyToReset()).toBeTruthy();
    });

    it('should handle empty string values as falsy', () => {
      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: '',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'test-token'
      }));

      expect(service.readyToReset()).toBeFalsy();
    });
  });

  describe('loading state', () => {

    it('should be false when ready to reset and no active operation', () => {
      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'test-user-id',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'test-token'
      }));

      expect(service.loading()).toBeFalsy();
    });
  });

  describe('resetPwd method', () => {
    beforeEach(() => {
      // Setup valid query params for reset
      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'test-user-id',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'test-reset-token'
      }));
    });

    it('should call AccountIoService.resetPassword with correct DTO', (done) => {
      const mockResponse: MessageResponseDto = {
        message: 'Password reset successful'
      };
      (mockAccountIoService.resetPassword as jest.Mock).mockReturnValue(of(mockResponse));

      const formData = {
        newPassword: 'NewSecure123!',
        confirmPassword: 'NewSecure123!'
      };

      // Use setTimeout to allow async operations to complete
      setTimeout(() => {
        expect(mockAccountIoService.resetPassword).toHaveBeenCalledWith({
          userId: 'test-user-id',
          resetToken: 'test-reset-token',
          newPassword: 'NewSecure123!',
          confirmPassword: 'NewSecure123!'
        } as ResetPwdDto);
        expect(service.successMsg()).toBeTruthy();
        done();
      }, 0);

      service.resetPwd(formData);
    });

    it('should emit success message on successful reset', (done) => {
      const mockResponse: MessageResponseDto = {
        message: 'Password reset successful'
      };
      (mockAccountIoService.resetPassword as jest.Mock).mockReturnValue(of(mockResponse));

      // Use setTimeout to allow async operations to complete
      setTimeout(() => {
        expect(service.successMsg()).toBeTruthy();
        done();
      }, 0);

      service.resetPwd({
        newPassword: 'NewSecure123!',
        confirmPassword: 'NewSecure123!'
      });
    });

    it('should emit error message on failed reset', (done) => {
      const errorMessage = 'Invalid reset token';
      (mockAccountIoService.resetPassword as jest.Mock).mockReturnValue(throwError(() => new Error(errorMessage)));

      // Use setTimeout to allow async operations to complete
      setTimeout(() => {
        expect(service.errorMsg()).toContain(errorMessage);
        done();
      }, 10);

      service.resetPwd({
        newPassword: 'NewSecure123!',
        confirmPassword: 'NewSecure123!'
      });
    });


    it('should clear previous error/success messages on new reset attempt', (done) => {
      // First attempt - error
      (mockAccountIoService.resetPassword as jest.Mock).mockReturnValue(throwError(() => new Error('First error')));

      service.resetPwd({
        newPassword: 'WrongPassword',
        confirmPassword: 'WrongPassword'
      });

      setTimeout(() => {
        // Verify error was set
        expect(service.errorMsg()).toContain('First error');
        // Second attempt - success
        const mockResponse: MessageResponseDto = {
          message: 'Password reset successful'
        };
        (mockAccountIoService.resetPassword as jest.Mock).mockReturnValue(of(mockResponse));

        service.resetPwd({
          newPassword: 'NewSecure123!',
          confirmPassword: 'NewSecure123!'
        });

        setTimeout(() => {
          expect(service.successMsg()).toBeTruthy();
          expect(service.errorMsg()).toBeFalsy(); // Error should be cleared
          done();
        }, 10);
      }, 10);
    });
  });

  describe('reactive state behavior', () => {


    it('should handle multiple rapid state changes', () => {
      // Rapid changes
      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'user1'
      }));

      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'user1',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'token1'
      }));

      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'user2',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'token2'
      }));

      // Should end up being ready
      expect(service.readyToReset()).toBeTruthy();
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'test-user-id',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'test-token'
      }));
    });

    it('should handle network errors gracefully', (done) => {
      const networkError = new Error('Network connection failed');
      (mockAccountIoService.resetPassword as jest.Mock).mockReturnValue(throwError(() => networkError));

      service.resetPwd({
        newPassword: 'NewSecure123!',
        confirmPassword: 'NewSecure123!'
      });

      setTimeout(() => {
        expect(service.errorMsg()).toContain('Network connection failed');
        expect(service.loading()).toBeFalsy(); // Should not be loading after error
        done();
      }, 10);
    });

    it('should handle server validation errors', (done) => {
      const validationError = {
        message: 'Password does not meet requirements',
        errors: ['Password too weak']
      };
      (mockAccountIoService.resetPassword as jest.Mock).mockReturnValue(throwError(() => validationError));

      service.resetPwd({
        newPassword: 'weak',
        confirmPassword: 'weak'
      });

      setTimeout(() => {
        expect(service.errorMsg()).toContain('Password does not meet requirements');
        done();
      }, 10);
    });
  });

  describe('signal integration', () => {
    it('should properly integrate toSignal with observables', () => {
      // Test that signals are properly updated when observables emit
      expect(service.readyToReset()).toBeFalsy();

      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'test-user',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'test-token'
      }));

      // Signal should immediately reflect the new value
      expect(service.readyToReset()).toBeTruthy();
    });

    it('should compute erroMsg if missing params', () => {

      // Test the computed nature of readyToReset and loading

      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: '',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'test-token'
      }));

      expect(service.errorMsg()).toBeTruthy(); // Ready and no operation = not loading
    });


    it('should NOT compute erroMsg if NO missing params', () => {


      queryParamMapSubject.next(convertToParamMap({
        [MyIdRouteInfo.Params.USER_ID_KEY]: 'test-user',
        [MyIdRouteInfo.Params.RESET_PWD_TOKEN_KEY]: 'test-token'
      }));

      expect(service.errorMsg()).toBeFalsy(); // Ready and no operation = not loading
    });
  });
});
