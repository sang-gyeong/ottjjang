import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoginService {
  private main$: any;

  constructor(private http: HttpClient) {}

  get(): Observable<any> {
    if (!this.main$) {
      this.refresh();
    }
    return this.main$;
  }

  redirectToLogin(url?: string, next?: string, force?: boolean): void {
    window.location.href = `${environment.service_url}/api/auth/login`;
  }

  refresh(): Observable<any> {
    return (this.main$ = this.http.get<any>(`${environment.service_url}/api/main`).pipe(shareReplay(1)));
  }
}
