import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, AlertController, NavController} from 'ionic-angular';
import {LoginPage} from "../pages/login/login";
import {GuideAreaPage} from "../pages/guide-area/guide-area";
import {HomePage} from "../pages/home/home";
import {Push, PushObject, PushOptions} from "@ionic-native/push";
import {AcceptTour} from "../pages/accept-tour/accept-tour";
import {Http, RequestOptions, Headers} from "@angular/http";
import {PendingTour} from "../pages/PendingTour/pending-tour";


@Component({
  templateUrl: 'app.html',

})
export class MyApp {
  @ViewChild('rootNavController') nav: NavController;
  rootPage = LoginPage;
  public ipv4 = "139.162.184.140";

  constructor(public platform: Platform,
  public push: Push,
  public alertCtrl: AlertController,
  public http: Http) {
    this.platform.registerBackButtonAction(()=>{

    });
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
      console.log("device token ->" + data.registrationId);
      window.localStorage.setItem("token",data.registrationId);
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data.message);
      console.log(data);
      //if user using app and push notification comes)
      if(data.message.includes("Un Turista sta cercando una guida"))
      {
        if (data.additionalData.foreground) {
          // if application open, show popup
          console.log(data);
          let confirmAlert = this.alertCtrl.create({
            title: 'Thiago',
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'Accept',
              handler: () => {
                this.getTour(data.additionalData.tour_id,data.additionalData.place_name,data.additionalData.place_location,data.additionalData.guida_id);
              }
            }]
          });
          confirmAlert.present();
        } else {
          if(window.localStorage.getItem("background-push")=="true") {
            window.localStorage.setItem("background-push","false");
            console.log(data);
            let confirmAlert = this.alertCtrl.create({
              title: 'Thiago',
              message: data.message,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              }, {
                text: 'Accept',
                handler: () => {
                  this.getTour(data.additionalData.tour_id,data.additionalData.place_name,data.additionalData.place_location,data.additionalData.guida_id);
                }
              }]
            });
            confirmAlert.present();

          }else{
            window.localStorage.setItem("background-push","true");
          }
          console.log("Push notification clicked");
        }
      }
      if(data.message.includes("Abbiamo trovato la guida che fa per te"))
      {
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.alertCtrl.create({
            title: 'Thiago',
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                this.getGuide(data.additionalData.guida_id);
              }
            }]
          });
          confirmAlert.present();
        } else {
          if(window.localStorage.getItem("background-push")=="true") {
            window.localStorage.setItem("background-push","false")
            let confirmAlert = this.alertCtrl.create({
              title: 'Thiago',
              message: data.message,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              }, {
                text: 'View',
                handler: () => {
                  this.getGuide(data.additionalData.guida_id);
                }
              }]
            });
            confirmAlert.present();

          }else{
            window.localStorage.setItem("background-push","true");
          }
          console.log("Push notification clicked");
        }
      }

    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  private getTour(tour_id, place_name, place_location, guida_id) {
    let link = 'http://' + this.ipv4 +':31206/api/acceptGuide';
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    let data = JSON.stringify({id_tour: tour_id, id_guida: guida_id});
    console.log({id_tour: tour_id, id_guida: guida_id});
    this.http.post(link, data, options)
      .subscribe(data => {
        this.nav.setRoot(PendingTour);
      }, error => {
        alert("time out from server!" + error.code);
        console.log(error);
      });
  }
  private getGuide(guida_id) {
    this.nav.setPages([ { page: PendingTour } ]);
    window.localStorage.setItem("guide-found","guide-found");



  }
}
