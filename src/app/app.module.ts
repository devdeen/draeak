import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule,routs } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { HttpClientModule } from '@angular/common/http';
import { ReversePipe } from './reverse.pipe';

const firebaseConfig = {
  apiKey: "AIzaSyD0XMH__lCM5SDa--EVOEdWzjLeqBScPek",
  authDomain: "raeak-iq.firebaseapp.com",
  databaseURL: "https://raeak-iq.firebaseio.com",
  projectId: "raeak-iq",
  storageBucket: "raeak-iq.appspot.com",
  messagingSenderId: "1080915289978"
};


@NgModule({
  declarations: [
    AppComponent,
    routs,
    ReversePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
