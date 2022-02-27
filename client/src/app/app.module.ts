import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {LoginService} from './services/login.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpInterceptorService} from './services/httpInterceptor.service';
import * as fromRoot from './reducers/main.reducer';
import {MainGuard} from './guards/main.guard';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, WrapperComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({
      main: fromRoot.reducer,
    }),
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}, LoginService, MainGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
