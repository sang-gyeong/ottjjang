import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PwHomeComponent} from './components/pw-home/pw-home.component';

const routes: Routes = [{path: '', component: PwHomeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
