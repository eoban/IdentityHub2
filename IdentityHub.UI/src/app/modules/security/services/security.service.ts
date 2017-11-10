import { UserService } from './user.service';
import { SecureHttpService } from './secure-http.service';
import { Injectable, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SecurityService {
  baseUrl = 'http://localhost:3000';

  constructor( @Inject(DOCUMENT) document: any, private _http: SecureHttpService, private _userSvc: UserService) {
    _userSvc.clearUser();
    const token = SecurityService.extractToken(document.location.hash);
    if (token) {
      document.location.hash = '';
      this._userSvc.setToken(token);
      this.getUser();
    }
  }

  static extractToken(hash): any {
    const query = hash.substring(1);
    const params = {};
    query.split('&').forEach(element => {
      const item = element.split('=');
      params[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
    });
    return params['token'];
  }

  getUser = () => {
    return this._http.get(this.baseUrl + '/api/auth/getUserInfo')
    .map(data => {
      return data.json();
    }).subscribe(
      data => this._userSvc.setUser({user: data['user'], token: this._userSvc.getToken()}),
      error => this._userSvc.clearUser()
    );
  }

  removeUser = () => this._userSvc.clearUser();
}
