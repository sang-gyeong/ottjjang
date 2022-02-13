import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PwHomeComponent} from './components/pw-home/pw-home.component';
import {DrawRoutingModule} from './draw-routing.module';

@NgModule({
  declarations: [PwHomeComponent],
  imports: [CommonModule, DrawRoutingModule],
})
export class DrawModule {}
