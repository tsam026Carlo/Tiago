import { Component } from '@angular/core';
import {NavController, NavParams, ViewController, MenuController, ModalController} from 'ionic-angular';
import {Headers, RequestOptions, Http} from "@angular/http";
import {Timer} from "../timer/timer";

/*
  Generated class for the Detail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {

  nome : any;
  id : any;
  private ipv4 = "139.162.184.140";
  private photo: any;
  private detail: any;
  private tourLenght: any;
  private paese: any;
  private prezzo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public http: Http, public modalCtrl: ModalController ) {
    this.id = navParams.get("id");
    var link = 'http://'+this.ipv4+':31206/api/getPlaceDetail';
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    var data = JSON.stringify({id: this.id});

    this.http.post(link, data, options)
      .subscribe(data => {
        if(data.json().success){
          this.photo = 'http://'+this.ipv4+':80/tiago/photo/'+ data.json().data[0].photo;
          this.detail = data.json().data[0].detail;
          this.nome = data.json().data[0].name.toUpperCase();
          this.paese = data.json().data[0].paese;
          this.prezzo = data.json().data[0].prezzo;
          this.tourLenght = data.json().data[0].tourLenght;

        } else {
          alert("error \nan error occurred");
        }
      }, error => {
        alert("an error occurred!");
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  apriTimer(){
    this.navCtrl.setRoot(Timer, {"id": this.id})
  }

}
