import { UserService } from './modules/security/services/user.service';
import { SecurityService } from './modules/security/services/security.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private _secSvc: SecurityService, _userSvc: UserService) {
    _userSvc.User.subscribe(data => console.log(JSON.stringify(data)));
  }
}
