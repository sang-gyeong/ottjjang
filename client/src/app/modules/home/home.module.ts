import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PwHomeComponent} from './components/pw-home/pw-home.component';
import {HomeRoutingModule} from './home-routing.module';
import {LoginService} from 'src/app/services/login.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpInterceptorService} from 'src/app/services/httpInterceptor.service';
@NgModule({
  declarations: [PwHomeComponent],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}, LoginService],
  imports: [CommonModule, HomeRoutingModule, HttpClientModule],
})
export class HomeModule {}
