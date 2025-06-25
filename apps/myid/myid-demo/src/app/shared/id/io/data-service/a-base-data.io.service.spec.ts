import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { of, throwError, firstValueFrom } from 'rxjs';
import { ABaseHttpService } from './a-base-data.io.service';
import { MyIdIoLoggerService } from './io-logger';
import { HttpGetOptions, HttpPostOptions, HttpPatchOptions, HttpDeleteOptions } from './http-options.types';
import { HttpError } from './io-errors';
import { provideHttpClientTesting } from '@angular/common/http/testing';

//###########################//

// Minimal concrete subclass for testing
class TestHttpService extends ABaseHttpService {
  constructor(url: string) { super(url); }
  public get<T>(opts: HttpGetOptions = {}) { return this._get<T>(opts); }
  public getById<T>(id: string | number | (string | number)[], opts: HttpGetOptions = {}) { return this._getById<T>(id, opts); }
  public post<T>(resource: object, opts: HttpPostOptions = {}) { return this._post<T>(resource, opts); }
  public patch<T>(resource: object, opts: HttpPatchOptions = {}) { return this._patch<T>(resource, opts); }
  public delete<T>(id: string | number | (string | number)[], opts: HttpDeleteOptions = {}) { return this._delete<T>(id, opts); }
}

const url =  '/api/test';

//###########################//

describe('ABaseHttpService', () => {
  let service: TestHttpService;
  let httpClient: HttpClient;
  let logger: jest.Mocked<MyIdIoLoggerService>;

  beforeEach(() => {
    logger = { error: jest.fn() } as jest.Mocked<MyIdIoLoggerService>;
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: MyIdIoLoggerService, useValue: logger },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.runInInjectionContext(() => new TestHttpService(url));
    httpClient = TestBed.inject(HttpClient);
    // Spy on HttpClient methods
    jest.spyOn(httpClient, 'get');
    jest.spyOn(httpClient, 'post');
    jest.spyOn(httpClient, 'patch');
    jest.spyOn(httpClient, 'delete');
  });

  it('should delegate _get to HttpClient.get', async () => {
    const expected = { foo: 'bar' };
    jest.spyOn(httpClient, 'get').mockReturnValue(of(expected));
    await expect(firstValueFrom(service.get())).resolves.toEqual(expected);
    expect(httpClient.get).toHaveBeenCalledWith(url, {});
  });

  it('should delegate _getById to HttpClient.get with correct url', async () => {
    const expected = { id: 1 };
    jest.spyOn(httpClient, 'get').mockReturnValue(of(expected));
    await expect(firstValueFrom(service.getById(1))).resolves.toEqual(expected);
    expect(httpClient.get).toHaveBeenCalledWith('/api/test/1', {});
  });

  it('should delegate _post to HttpClient.post', async () => {
    const payload = { foo: 'bar' };
    const expected = { ok: true };
    jest.spyOn(httpClient, 'post').mockReturnValue(of(expected));
    await expect(firstValueFrom(service.post(payload))).resolves.toEqual(expected);
    expect(httpClient.post).toHaveBeenCalledWith(url, payload, {});
  });

  it('should delegate _patch to HttpClient.patch', async () => {
    const payload = { foo: 'baz' };
    const expected = { ok: true };
    jest.spyOn(httpClient, 'patch').mockReturnValue(of(expected));
    await expect(firstValueFrom(service.patch(payload))).resolves.toEqual(expected);
    expect(httpClient.patch).toHaveBeenCalledWith(url, payload, {});
  });

  it('should delegate _delete to HttpClient.delete', async () => {
    const expected = { deleted: true };
    jest.spyOn(httpClient, 'delete').mockReturnValue(of(expected));
    await expect(firstValueFrom(service.delete(1))).resolves.toEqual(expected);
    expect(httpClient.delete).toHaveBeenCalledWith('/api/test/1', {});
  });

  it('should handle errors and map them using HttpError.getErrorFromHttpResponse', async () => {
    expect.assertions(3);
    const httpError = new HttpErrorResponse({ status: 400, error: 'Bad Request' });
    const mappedError = new HttpError('BadRequest', 400, 'Bad Request');
    jest.spyOn(HttpError, 'getErrorFromHttpResponse').mockReturnValue(mappedError);
    jest.spyOn(httpClient, 'get').mockReturnValue(throwError(() => httpError));
    try {
      await firstValueFrom(service.get());
    } catch (err) {
      expect(logger.error).toHaveBeenCalledWith('httpErrorResponse', httpError);
      expect(HttpError.getErrorFromHttpResponse).toHaveBeenCalledWith(httpError);
      expect(err).toBe(mappedError);
    }
  });

  it('should call extractData and return the response as-is', async () => {
    const expected = { foo: 'bar' };
    jest.spyOn(httpClient, 'get').mockReturnValue(of(expected));
    await expect(firstValueFrom(service.get())).resolves.toEqual(expected);
  });
});
