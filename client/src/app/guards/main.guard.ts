import {Injectable} from '@angular/core';
import {CanActivate, UrlTree} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {catchError, mapTo, tap} from 'rxjs/operators';
import * as mainActions from '../actions/main.action';
import * as fromRoot from '../reducers/main.reducer';
import {LoginService} from '../services/login.service';

@Injectable()
export class MainGuard implements CanActivate {
  constructor(private loginService: LoginService, private store$: Store<fromRoot.State>) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.loginService.get().pipe(
      tap(res => this.store$.dispatch(mainActions.loadMainDataComplete({res}))),
      mapTo(true),
      catchError(err => {
        throw err;
      })
    );
  }
}
