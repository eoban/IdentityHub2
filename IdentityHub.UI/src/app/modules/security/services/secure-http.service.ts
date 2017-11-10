import { Injectable } from '@angular/core';
import { Http, Request, Response, Headers, ConnectionBackend, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';

@Injectable()
export class SecureHttpService extends Http {
  constructor(protected _backend: ConnectionBackend, protected _defaultOptions: RequestOptions, protected _userSvc: UserService) {
    super(_backend, _defaultOptions);
  }

  _setCustomOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (!options) {
      options = new RequestOptions({});
    }
    const token = this._userSvc.getToken();
    if (!options.headers) {
      options.headers = new Headers();
    }
    options.headers = this._setCustomHeaders(options.headers);
    return options;
  }

  _setCustomHeaders(headers?: Headers): Headers {
    const token = this._userSvc.getToken();
    headers.set('content-type', 'application/json');
    if (token) {
      headers.append('Authorization', token);
    }
    return headers;
  }


  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (url instanceof String) {
      options = this._setCustomOptions(options);
    }else{
      url.headers = this._setCustomHeaders(url.headers);
    }
    return super.request(url, options);
  }
}