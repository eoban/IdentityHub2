import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class UserService {
  User = new ReplaySubject(1);

  constructor() { this.User.next((this.getUser() ? this.getUser()['user'] : null)); }

  getUser = () => JSON.parse(localStorage.getItem('UserPacket'));
  getToken = () => this.getUser()['token'];

  setUser = (userPacket) => {
    if (!userPacket){
      localStorage.removeItem('UserPacket');
    } else {
      localStorage.setItem('UserPacket', JSON.stringify(userPacket));
      if (userPacket['user']) {
        this.User.next(userPacket['user']);
      }
    }
  }

  clearUser = () => this.setUser(null);
  setToken = (token) => this.setUser({user: null, token: token});
}
