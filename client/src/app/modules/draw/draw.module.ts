import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PwHomeComponent} from './components/pw-home/pw-home.component';
import {DrawRoutingModule} from './draw-routing.module';
import {DoubleClickDirective} from 'src/app/directives/double-click.directive';
import {LongClickDirective} from 'src/app/directives/long-click.directive';

@NgModule({
  declarations: [PwHomeComponent, DoubleClickDirective, LongClickDirective],
  imports: [CommonModule, DrawRoutingModule],
})
export class DrawModule {}
