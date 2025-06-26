import { MyIdFallbackRouter } from './id-router.service';
import { Router, ActivatedRoute, UrlCreationOptions } from '@angular/router';
import { MyIdRouteInfo } from '../../my-id-route-info';
import { TestBed } from '@angular/core/testing';

// Mocks
const navigateMock = jest.fn();
const routerMock = { navigate: navigateMock } as unknown as Router;
const actRouteMock = {} as ActivatedRoute;

jest.mock('@angular/router', () => ({
  ...jest.requireActual('@angular/router'),
  Router: jest.fn(() => routerMock),
  ActivatedRoute: jest.fn(() => actRouteMock),
}));

// Optionally mock devConsole
jest.mock('@spider-baby/dev-console', () => ({
  devConsole: { log: jest.fn() },
}));

describe('MyIdFallbackRouter', () => {
  let service: MyIdFallbackRouter;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: actRouteMock },
        MyIdFallbackRouter,
      ],
    });
    service = TestBed.inject(MyIdFallbackRouter);
  });

  it('should navigate to login', () => {
    service.navigateToLogin();
    expect(navigateMock).toHaveBeenCalledWith(['../login'], { relativeTo: actRouteMock });
  });

  it('should navigate to change password', () => {
    service.navigateToChPwd();
    expect(navigateMock).toHaveBeenCalledWith(['../change-pwd'], { relativeTo: actRouteMock });
  });

  it('should navigate to verify-2-factor with token', () => {
    const token = 'abc123';
    service.navigateToVerify(token);
    expect(navigateMock).toHaveBeenCalledWith(
      ['../verify-2-factor'],
      {
        relativeTo: actRouteMock,
        queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_JEY]: token },
      }
    );
  });

  it('should navigate to verify-2-factor without token', () => {
    service.navigateToVerify();
    expect(navigateMock).toHaveBeenCalledWith(
      ['../verify-2-factor'],
      {
        relativeTo: actRouteMock,
        queryParams: {},
      }
    );
  });

  it('should navigate to home', () => {
    service.navigateToHome();
    expect(navigateMock).toHaveBeenCalledWith(['/' ], { relativeTo: actRouteMock });
  });

  it('should call navigate with commands and options', () => {
    const commands = ['/foo', 'bar'];
    const opts: UrlCreationOptions = { queryParams: { x: 1 } };
    service.navigate(commands, opts);
    expect(navigateMock).toHaveBeenCalledWith(commands, opts);
  });
});
