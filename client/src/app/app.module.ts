import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {EffectsModule} from '@ngrx/effects';
import {reducer} from './reducers/main.reducer';
import {MainEffects} from './effects/main.effects';
import {StoreModule} from '@ngrx/store';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {LoginService} from './services/login.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpInterceptorService} from './services/httpInterceptor.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, WrapperComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule.forFeature('main', reducer),
    EffectsModule.forFeature([MainEffects]),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}, LoginService],
  bootstrap: [AppComponent],
})
export class AppModule {}
