import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NetworkStatusComponent } from './network-status/network-status.component';
import { JwtInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [AppComponent,
     NetworkStatusComponent],
  imports: [BrowserModule,
     IonicModule.forRoot(),
      AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient(
    withInterceptorsFromDi(),
  ),  
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true 
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
