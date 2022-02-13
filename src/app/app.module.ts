import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {HttpInterceptorService} from './services/httpInterceptor.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, WrapperComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: false}],
  bootstrap: [AppComponent],
})
export class AppModule {}
