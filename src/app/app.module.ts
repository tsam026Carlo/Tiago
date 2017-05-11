import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {DetailPage} from "../pages/detail/detail";
import {LoginPage} from "../pages/login/login";
import {GuideAreaPage} from "../pages/guide-area/guide-area";
import { Geolocation } from '@ionic-native/geolocation';
import { BrowserModule } from '@angular/platform-browser';
import {Push} from "@ionic-native/push";
import {HttpModule} from "@angular/http";
import {NativeStorage} from "@ionic-native/native-storage";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Timer} from "../pages/timer/timer";
import {AcceptTour} from "../pages/accept-tour/accept-tour";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailPage,
    LoginPage,
    Timer,
    GuideAreaPage,
    AcceptTour
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailPage,
    LoginPage,
    Timer,
    GuideAreaPage,
    AcceptTour
  ],
  providers: [Geolocation,
              Push,
              NativeStorage,
              BarcodeScanner,
              {provide: ErrorHandler, useClass: IonicErrorHandler}
             ]
})
export class AppModule {}
