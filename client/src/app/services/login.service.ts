import {Injectable} from '@angular/core';

@Injectable()
export class LoginService {
  constructor() {}

  redirectToLogin(url?: string, next?: string, force?: boolean): void {
    window.location.href = 'http://localhost:3000/api/auth/login';
  }
}
