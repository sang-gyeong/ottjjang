import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PwHomeComponent} from './components/pw-home/pw-home.component';
import {DrawRoutingModule} from './draw-routing.module';
import {DoubleClickDirective} from 'src/app/directives/double-click.directive';
import {LongPressDirective} from 'src/app/directives/long-press.directive';

@NgModule({
  declarations: [PwHomeComponent, DoubleClickDirective, LongPressDirective],
  imports: [CommonModule, DrawRoutingModule],
})
export class DrawModule {}
