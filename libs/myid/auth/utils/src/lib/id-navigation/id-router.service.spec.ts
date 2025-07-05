import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, UrlCreationOptions } from '@angular/router';
import { MyIdRouteInfo } from '../my-id-route-info';
import { MyIdFallbackRouter } from './id-router.service';

// Mocks
const navigateByUrlMock = jest.fn();
const createUrlTreeMock = jest.fn();
const navigateMock = jest.fn();
const routerMock = {
  navigate: navigateMock,
  navigateByUrl: navigateByUrlMock,
  createUrlTree: createUrlTreeMock,
} as unknown as Router;
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
    createUrlTreeMock.mockImplementation((commands, opts) => ({ commands, opts }));
    navigateByUrlMock.mockResolvedValue(true);
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
    const urlTree = { commands: ['../login'], opts: { relativeTo: actRouteMock } };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToLogin();
    expect(createUrlTreeMock).toHaveBeenCalledWith(['../login'], { relativeTo: actRouteMock , queryParams: {} });
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should navigate to change password', () => {
    const urlTree = { commands: ['../change-pwd'], opts: { relativeTo: actRouteMock } };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToChPwd();
    expect(createUrlTreeMock).toHaveBeenCalledWith(['../change-pwd'], { relativeTo: actRouteMock });
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should navigate to verify-2-factor with token', () => {
    const token = 'abc123';
    const urlTree = {
      commands: ['../verify-2-factor'],
      opts: {
        relativeTo: actRouteMock,
        queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: token },
      },
    };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToVerify(token);
    expect(createUrlTreeMock).toHaveBeenCalledWith(
      ['../verify-2-factor'],
      {
        relativeTo: actRouteMock,
        queryParams: { [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: token },
      }
    );
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should navigate to verify-2-factor without token', () => {
    const urlTree = {
      commands: ['../verify-2-factor'],
      opts: {
        relativeTo: actRouteMock,
        queryParams: {},
      },
    };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToVerify();
    expect(createUrlTreeMock).toHaveBeenCalledWith(
      ['../verify-2-factor'],
      {
        relativeTo: actRouteMock,
        queryParams: {},
      }
    );
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should navigate to home', () => {
    const urlTree = { commands: ['/'], opts: { relativeTo: actRouteMock } };
    createUrlTreeMock.mockReturnValueOnce(urlTree);
    service.navigateToHome();
    expect(createUrlTreeMock).toHaveBeenCalledWith(['/' ], { relativeTo: actRouteMock });
    expect(navigateByUrlMock).toHaveBeenCalledWith(urlTree);
  });

  it('should call navigate with commands and options', () => {
    const commands = ['/foo', 'bar'];
    const opts: UrlCreationOptions = { queryParams: { x: 1 } };
    service.navigate(commands, opts);
    expect(navigateMock).toHaveBeenCalledWith(commands, opts);
  });
});
