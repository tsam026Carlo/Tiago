import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, AlertController} from 'ionic-angular';
import {LoginPage} from "../pages/login/login";
import {GuideAreaPage} from "../pages/guide-area/guide-area";
import {HomePage} from "../pages/home/home";
import {Push, PushObject, PushOptions} from "@ionic-native/push";
import {AcceptTour} from "../pages/accept-tour/accept-tour";


@Component({
  templateUrl: 'app.html',

})
export class MyApp {
  rootPage = LoginPage;
  @ViewChild(Nav) nav;

  constructor(public platform: Platform,
  public push: Push,
  public alertCtrl: AlertController) {

    this.initPushNotification();
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }



    const options: PushOptions = {
      android: {
        senderID: "902150850002"
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true"
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log("device token ->", data.registrationId);
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        console.log("Push notification clicked");
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

}
