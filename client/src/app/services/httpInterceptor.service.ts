import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('cookie', document.cookie);
    request = request.clone({
      withCredentials: true,
      setHeaders: {
        Accept: 'application/json',
        Authorization: `${document.cookie.split('token=')[1]}`,
      },
    });

    return next.handle(request);
  }
}
