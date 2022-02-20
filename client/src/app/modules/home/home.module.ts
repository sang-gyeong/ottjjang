import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PwHomeComponent} from './components/pw-home/pw-home.component';
import {HomeRoutingModule} from './home-routing.module';
import {LoginService} from 'src/app/services/login.service';
import {HttpClientModule} from '@angular/common/http';
@NgModule({
  declarations: [PwHomeComponent],
  providers: [LoginService],
  imports: [CommonModule, HomeRoutingModule, HttpClientModule],
})
export class HomeModule {}
