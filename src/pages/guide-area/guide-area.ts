import { Component } from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {RequestOptions, Headers, Http} from "@angular/http";
import {AcceptTour} from "../accept-tour/accept-tour";

/*
  Generated class for the GuideArea page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
//
// declare var FCMPlugin;
@Component({
  selector: 'page-guide-area',
  templateUrl: 'guide-area.html'
})
export class GuideAreaPage {

  photo : any;
  profileName: any;
  number: any;
  profileId: any;
  ipv4 = "139.162.184.140";


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public platform : Platform) {
    this.photo = "";
    this.profileName = "";
    this.platform.ready().then(() => {
        this.setupNotifications();
    });
  }




  event = new Event('build');

  setupNotifications() {
    // try {
    //
    //   window.addEventListener('build', function (e) {alert('ohsi!')}, false);
    // });
      // let fcmPlugin = FCMPlugin;
      // fcmPlugin.getToken(
      //   function (token) {
      //     alert(token);
      //     window.localStorage.setItem("token",token);
      //
      //   },
      //   function (err) {
      //     alert("error retrieving token: " + err);
      //
      //   });
      // fcmPlugin.onNotification(function (notification) {
      //   console.log(notification);
      //   window.localStorage.setItem("notification",JSON.stringify(notification));
      //   event = new Event('build');
      //   window.dispatchEvent(event);
      // }, function (succes) {
      //   //alert(error);
      //   console.log("success: "+succes);
      // }, function (error) {
      //   //alert(error);
      //   console.log("error:"+error);
      // });
      setTimeout(this.restCall(),2000);
    // }
    // catch (exception) {
    //   console.log(exception);
    // }
  }




  restCall(){
    let token = window.localStorage.getItem("token");
    if(token==null){
      setTimeout(this.restCall(),2000);
    } else {
    var link = 'http://'+this.ipv4+':31206/api/getUsers';
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({
      headers: headers
    });
    var data = "number="+window.localStorage.getItem("number")+"&token="+token;
    this.http.post(link, data, options)
      .subscribe(data => {
        var dataAsJson = data.json();
        this.photo = 'http://'+this.ipv4+':80/tiago/photo/'+ dataAsJson.photo;
        //this.profileName = dataAsJson.name;
        this.profileId = dataAsJson.id;
        this.number = dataAsJson.number;
      }, error => {
        alert("An error occurred");
        //this.loader.dismiss();
      });
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad GuideAreaPage');
  }

  private openAccept() {
    // if(window.localStorage.getItem("notification")!=null){
    //   this.navCtrl.push(AcceptTour);
    // }
    // else{
    //   setTimeout(this.openAccept(),5000);
    // }

  }
}
