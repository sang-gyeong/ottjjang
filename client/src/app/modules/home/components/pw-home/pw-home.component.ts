import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {LoginService} from 'src/app/services/login.service';
import * as mainActions from '../../../../actions/main.action';
import * as MainReducer from '../../../../reducers/main.reducer';

@Component({
  selector: 'app-pw-home',
  templateUrl: './pw-home.component.html',
  styleUrls: ['./pw-home.component.css'],
})
export class PwHomeComponent implements OnInit {
  constructor(private loginService: LoginService, private store$: Store<MainReducer.State>) {}

  ngOnInit(): any {}

  onClickLogin(): any {
    this.loginService.redirectToLogin();
  }
}
