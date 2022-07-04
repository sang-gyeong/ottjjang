import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PwHomeComponent} from './components/pw-home/pw-home.component';
import {MypageRoutingModule} from './mypage-routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpInterceptorService} from 'src/app/services/httpInterceptor.service';

@NgModule({
  declarations: [PwHomeComponent],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}],
  imports: [CommonModule, HttpClientModule, MypageRoutingModule],
})
export class MypageModule {}
