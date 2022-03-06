import {Component, OnInit} from '@angular/core';
import {createSelector, Store} from '@ngrx/store';
import {selectUser} from 'src/app/reducers/main.reducer';
import {LoginService} from 'src/app/services/login.service';
import * as fromMain from '../../reducers/main.reducer';

const selectVM = createSelector(selectUser, user => {
  if (!user) {
    return null;
  }

  return {
    nickname: user.nickname,
    profileURL: user.profileURL,
  };
});

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  vm$ = this.store$.select(selectVM);

  constructor(private store$: Store<fromMain.State>, private loginService: LoginService) {}

  ngOnInit(): void {}

  onClickLogin(): any {
    this.loginService.redirectToLogin();
  }
}
