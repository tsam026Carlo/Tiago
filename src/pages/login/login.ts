import { Component } from '@angular/core';
import {NavController, NavParams, Platform, MenuController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {Http, Headers, RequestOptions} from "@angular/http";


/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  number : any;
  private ipv4 = "139.162.184.140";

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform , public http: Http, public menuCtrl: MenuController) {


    //per skippare il log-in
    //this.navCtrl.setRoot(HomePage);
    //


    menuCtrl.enable(false);



    if(window.localStorage.getItem("number")!=null)
    {
                var numberFound = window.localStorage.getItem("number");
                console.log(numberFound); // Logs output to dev tools console.
                this.navCtrl.setRoot(HomePage);
    }
  }

  onEnterPressed(){
    this.number =  (<HTMLInputElement>document.getElementById("number")).value;
    var link = 'http://'+this.ipv4+':31206/api/register';
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    var data = JSON.stringify({phone: this.number});

    this.http.post(link, data, options)
      .subscribe(data => {
        if(data.json().success){
          var stri = JSON.stringify(data);
          this.saveNumber();
          if(stri.includes("Guide")){
            window.localStorage.setItem('guide',"true");
          }
          else{
            window.localStorage.setItem('guide',"false");
          }
          this.navCtrl.setRoot(HomePage);
        } else {
          console.log(data);
          alert("error\n the number is alredy registered");
        }
      }, error => {
        alert("time out from server!"+error.code);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  saveNumber(){
    window.localStorage.setItem('number' , this.number);
  }


  onTextChanged(){
    if((<HTMLInputElement>document.getElementById("number")).value!=""){
      document.getElementById("enter").removeAttribute("disabled");
    }else{
      document.getElementById("enter").setAttribute("disabled","");
    }
  }

}
