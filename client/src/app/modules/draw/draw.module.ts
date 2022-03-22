import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PwHomeComponent} from './components/pw-home/pw-home.component';
import {DrawRoutingModule} from './draw-routing.module';
import {DoubleClickDirective} from 'src/app/directives/double-click.directive';
import {LongPressDirective} from 'src/app/directives/long-press.directive';
import {StoreModule} from '@ngrx/store';
import * as fromDraw from './reducers/draw.reducer';
import {EffectsModule} from '@ngrx/effects';
import {DrawEffect} from './effects/draw.effect';
import {DrawService} from './services/draw.service';

@NgModule({
  declarations: [PwHomeComponent, DoubleClickDirective, LongPressDirective],
  imports: [
    CommonModule,
    DrawRoutingModule,
    StoreModule.forFeature('draw', fromDraw.reducer),
    EffectsModule.forFeature([DrawEffect]),
  ],
  providers: [DrawService],
})
export class DrawModule {}
