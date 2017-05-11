import {Component, ViewChild} from '@angular/core';
import {Platform, Nav} from 'ionic-angular';
import {LoginPage} from "../pages/login/login";
import {GuideAreaPage} from "../pages/guide-area/guide-area";
import {HomePage} from "../pages/home/home";
import {Push} from "@ionic-native/push";


@Component({
  templateUrl: 'app.html',

})
export class MyApp {
  rootPage = LoginPage;
  @ViewChild(Nav) nav;

  constructor(public platform: Platform, public pu: Push) {
    //this.initializeApp()
  }

  initializeApp() {

    }
}
