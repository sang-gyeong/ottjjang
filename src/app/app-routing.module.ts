import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WrapperComponent} from './components/wrapper/wrapper.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    component: WrapperComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then(mod => mod.HomeModule),
        data: {title: '홈'},
      },
    ],
  },
  {
    path: 'error',
    component: WrapperComponent,
    loadChildren: () => import('./modules/error/error.module').then(mod => mod.ErrorModule),
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'disabled', relativeLinkResolution: 'legacy'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
