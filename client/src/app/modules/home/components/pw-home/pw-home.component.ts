import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {LoginService} from 'src/app/services/login.service';

@Component({
  selector: 'app-pw-home',
  templateUrl: './pw-home.component.html',
  styleUrls: ['./pw-home.component.css'],
})
export class PwHomeComponent implements OnInit {
  constructor(private loginService: LoginService, private http: HttpClient) {}

  ngOnInit(): any {
    console.log(document.cookie);
    return this.http
      .get('http://localhost:3000/api/main', {
        headers: {'Content-Type': 'application/json', Authorization: `${document.cookie.split('=')[1]}`},
      })
      .subscribe(v => console.log(v));
  }

  onClickLogin(): any {
    this.loginService.redirectToLogin();
  }
}
