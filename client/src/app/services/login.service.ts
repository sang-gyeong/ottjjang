import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  loadMainData(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/main');
  }

  redirectToLogin(url?: string, next?: string, force?: boolean): void {
    window.location.href = 'http://localhost:3000/api/auth/login';
  }
}
