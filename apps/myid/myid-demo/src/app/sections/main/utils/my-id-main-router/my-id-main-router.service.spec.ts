import { Router, UrlCreationOptions } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AppRouteDefs } from '../../../../app-route-defs';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';
import { MyIdMainRouterService } from './my-id-main-router.service';

const navigateMock = jest.fn();
const routerMock = { navigate: navigateMock } as unknown as Router;

describe('MyIdMainRouterService', () => {
  let service: MyIdMainRouterService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppRouteDefs.fullPathsWithSlash.main, 'route').mockImplementation((route?: string) => `/${route}`);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        MyIdMainRouterService,
      ],
    });
    service = TestBed.inject(MyIdMainRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to login', () => {
    service.navigateToLogin();
    expect(navigateMock).toHaveBeenCalledWith([AppRouteDefs.fullPathsWithSlash.main.route('login-jwt')]);
  });

  it('should navigate to change password', () => {
    service.navigateToChPwd();
    expect(navigateMock).toHaveBeenCalledWith([AppRouteDefs.fullPathsWithSlash.main.route('change-pwd')]);
  });

  it('should navigate to home', () => {
    service.navigateToHome();
    expect(navigateMock).toHaveBeenCalledWith([AppRouteDefs.fullPathsWithSlash.main.route('home')]);
  });

  // it('should navigate to verify-2-factor with token(Cookie)', () => {
  //   const token = 'abc123';
  //   service.navigateToVerify(token);
  //   expect(navigateMock).toHaveBeenCalledWith(
  //     [AppRouteDefs.fullPathsWithSlash.main.route('verify-2-factor-cookie')],
  //     { queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN]: token } }
  //   );
  // });

  // it('should navigate to verify-2-factor without token (Cookie)', () => {
  //   service.navigateToVerify();
  //   expect(navigateMock).toHaveBeenCalledWith(
  //     [AppRouteDefs.fullPathsWithSlash.main.route('verify-2-factor-cookie')],
  //     { queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN]: undefined } }
  //   );
  // });

    it('should navigate to verify-2-factor with token (JWT)', () => {
    const token = 'abc123';
    service.navigateToVerify(token);
    expect(navigateMock).toHaveBeenCalledWith(
      [AppRouteDefs.fullPathsWithSlash.main.route('verify-2-factor')],
      { queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN]: token } }
    );
  });

  it('should navigate to verify-2-factor without token (JWT)', () => {
    service.navigateToVerify();
    expect(navigateMock).toHaveBeenCalledWith(
      [AppRouteDefs.fullPathsWithSlash.main.route('verify-2-factor')],
      { queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN]: undefined } }
    );
  });

  it('should call navigate with commands and options', () => {
    const commands = ['/foo', 'bar'];
    const opts: UrlCreationOptions = { queryParams: { x: 1 } };
    service.navigate(commands, opts);
    expect(navigateMock).toHaveBeenCalledWith(commands, opts);
  });
});
