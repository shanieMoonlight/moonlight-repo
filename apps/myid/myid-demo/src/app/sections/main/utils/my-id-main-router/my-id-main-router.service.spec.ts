import { Router, UrlCreationOptions } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AppRouteDefs } from '../../../../app-route-defs';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';
import { MyIdMainRouterService } from './my-id-main-router.service';

const navigateByUrlMock = jest.fn();
const createUrlTreeMock = jest.fn();
const navigateMock = jest.fn();
const routerMock = {
  navigate: navigateMock,
  navigateByUrl: navigateByUrlMock,
  createUrlTree: createUrlTreeMock,
} as unknown as Router;

describe('MyIdMainRouterService', () => {
  let service: MyIdMainRouterService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppRouteDefs.fullPathsWithSlash.main, 'route').mockImplementation((route?: string) => `/${route}`);
    createUrlTreeMock.mockImplementation((commands, opts) => ({ commands, opts }));
    navigateByUrlMock.mockResolvedValue(true);
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
    const urlTree = { commands: ['/login-jwt'], opts: undefined };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToLogin();
    expect(createUrlTreeMock).toHaveBeenCalledWith([AppRouteDefs.fullPathsWithSlash.main.account.route('login-jwt')]);
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should navigate to change password', () => {
    const urlTree = { commands: ['/change-pwd'], opts: undefined };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToChPwd();
    expect(createUrlTreeMock).toHaveBeenCalledWith([AppRouteDefs.fullPathsWithSlash.main.account.route('change-password')]);
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should navigate to home', () => {
    const urlTree = { commands: ['/home'], opts: undefined };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToHome();
    expect(createUrlTreeMock).toHaveBeenCalledWith([AppRouteDefs.fullPathsWithSlash.main.route('home')]);
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should navigate to verify-2-factor with token (JWT)', () => {
    const token = 'abc123';
    const urlTree = {
      commands: [AppRouteDefs.fullPathsWithSlash.main.account.route('verify-2-factor')],
      opts: { queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: token } },
    };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToVerify(token);
    expect(createUrlTreeMock).toHaveBeenCalledWith(
      [AppRouteDefs.fullPathsWithSlash.main.account.route('verify-2-factor')],
      { queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: token } }
    );
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should navigate to verify-2-factor without token (JWT)', () => {
    const urlTree = {
      commands: [AppRouteDefs.fullPathsWithSlash.main.account.route('verify-2-factor')],
      opts: { queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: undefined } },
    };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToVerify();
    expect(createUrlTreeMock).toHaveBeenCalledWith(
      [AppRouteDefs.fullPathsWithSlash.main.account.route('verify-2-factor')],
      { queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: undefined } }
    );
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should call navigate with commands and options', () => {
    const commands = ['/foo', 'bar'];
    const opts: UrlCreationOptions = { queryParams: { x: 1 } };
    service.navigate(commands, opts);
    expect(navigateMock).toHaveBeenCalledWith(commands, opts);
  });
});
