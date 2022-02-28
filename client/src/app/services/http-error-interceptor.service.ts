import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {get, startsWith} from 'lodash';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LoginService} from './login.service';

// 사용하지 않지만 기록차 남겨둠
export enum CustomHttpError {
  MAINTENANCE = -10008, // 점검 중 (응답 코드는 503이라고 함)
}

@Injectable()
export class HttpErrorInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    private ls: LoginService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(err => {
        const code = get(err, ['status', 'errorCode']);

        console.log(code)

        return throwError(err);
      })
    );
  }
}
