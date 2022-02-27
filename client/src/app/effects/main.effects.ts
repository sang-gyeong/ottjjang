import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';
import * as mainActions from '../actions/main.action';
import {LoginService} from '../services/login.service';

@Injectable()
export class MainEffects {
  loadMainData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(mainActions.loadMainData),
      switchMap(() => this.loginService.loadMainData()),
      map(res => mainActions.loadMainDataComplete({res}))
    )
  );

  constructor(private actions$: Actions, private store: Store<any>, private loginService: LoginService) {}
}
