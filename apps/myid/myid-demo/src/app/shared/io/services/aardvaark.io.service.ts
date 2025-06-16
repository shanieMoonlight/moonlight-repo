import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AServerIoService } from './base/base-server-io.service';
import { ServerRoutes } from '../controllers/all-server-routes';
import {
  MessageResponseDto,
  WeatherForecast,
  IWeatherForecastList,
} from '../models';

@Injectable({ providedIn: 'root' })
export class AardvaarkIoService extends AServerIoService {
  constructor() {
    super(ServerRoutes.Aardvaark.Controller);
  }

  index = (opts?: unknown): Observable<MessageResponseDto> =>
    this._getAction<MessageResponseDto>(
      ServerRoutes.Aardvaark.action('index'),
      opts ?? {}
    );

  get = (opts?: unknown): Observable<WeatherForecast[]> =>
    this._get<WeatherForecast[]>(opts ?? {});

  post = (
    dto: WeatherForecast,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._post<MessageResponseDto>(dto, opts ?? {});

  patch = (
    dto: IWeatherForecastList,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._patch<MessageResponseDto>(dto, opts ?? {});

  deleteById = (id: number, opts?: unknown): Observable<MessageResponseDto> =>
    this._delete<MessageResponseDto>([id], opts ?? {});

  getByUserId = (
    userId: string,
    opts?: unknown
  ): Observable<MessageResponseDto> =>
    this._getById<MessageResponseDto>([userId], opts ?? {});
}
