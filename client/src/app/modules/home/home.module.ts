import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PwHomeComponent} from './components/pw-home/pw-home.component';
import {HomeRoutingModule} from './home-routing.module';

@NgModule({
  declarations: [PwHomeComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
