import { UserService } from './services/user.service';
import { SecureHttpService } from './services/secure-http.service';
import { SecurityService } from './services/security.service';
import { NgModule } from '@angular/core';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { CommonModule } from '@angular/common';

export function secureHttpFactory(
  xhrBackend: XHRBackend,
  requestOptions: RequestOptions,
  userService: UserService
): Http {
  return new SecureHttpService(
    xhrBackend,
    requestOptions,
    userService
  );
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  providers: [
    SecurityService,
    UserService,
    { provide: SecureHttpService, useFactory: secureHttpFactory, deps: [XHRBackend, RequestOptions, UserService] }
  ],
  declarations: []
})
export class SecurityModule { }
