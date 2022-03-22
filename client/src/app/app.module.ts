import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpErrorInterceptorService} from './services/http-error-interceptor.service';
import {StoreModule} from '@ngrx/store';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {LoginService} from './services/login.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpInterceptorService} from './services/httpInterceptor.service';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import * as fromRoot from './reducers/main.reducer';
import {MainGuard} from './guards/main.guard';
import {PcHeaderComponent} from './components/header/pc-header/pc-header.component';
import {EffectsModule} from '@ngrx/effects';
import {environment} from 'src/environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, WrapperComponent, PcHeaderComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({
      main: fromRoot.reducer,
    }),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    NgbModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptorService, multi: true},
    LoginService,
    MainGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
