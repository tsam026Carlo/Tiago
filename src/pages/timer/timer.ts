import { Component } from '@angular/core';
import {NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {RequestOptions, Headers, Http} from "@angular/http";
import {NativeStorage} from "@ionic-native/native-storage";
import {HomePage} from "../home/home";
/**
 * Generated class for the Timer page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-timer',
  templateUrl: 'timer.html',
})
export class Timer {


  public ipv4 = "139.162.184.140";
  private sentence: any;
  private actualsentence: any;
  private actualsentenceIndex: any;
  private staticSentence:any;
  private timer:ITimer;
  public id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public nativeStorage: NativeStorage, public http: Http, public viewCtrl: ViewController) {
    this.staticSentence = "Stiamo cercando la tua guida";
    this.platform.ready().then(() => {

      this.id = this.navParams.get("id");
      console.log(this.id+"--- ccc");

      var number = window.localStorage.getItem("number");
      this.restCall(number, this.id);

      this.sentence = ["Stiamo notificando tutte le guide abilitate per questo punto" , "La prima guida che accettera\' l\' incarico ricevera\' i tuoi dati e ti contattera\' immediatamente", "A termine della visita potrai dare un voto da uno a cinque al servizio ricevuto", "Aiutaci a migliorare e condividi la tua esperienza sui social con #tiago"];
      this.actualsentenceIndex = 0;
      this.actualsentence =  this.sentence[this.actualsentenceIndex];
      this.initTimer();
    });
  }


  initTimer() {
    this.timer = <ITimer>{
      seconds: 20,
      runTimer: false,
      hasStarted: false,
      hasFinished: false,
      secondsRemaining: 20
    };

    this.timer.displayTime = Timer.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    this.startTimer();
  }

  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }


  timerTick() {
    setTimeout(() => {
      if (!this.timer.runTimer) { return; }
      this.timer.secondsRemaining--;
      this.timer.displayTime = Timer.getSecondsAsDigitalClock(this.timer.secondsRemaining);
      if(window.localStorage.getItem("guide-found")=="guide-found"){
        window.localStorage.setItem("guide-found",null);
        this.viewCtrl.dismiss();
        return 1;
      }
      if (this.timer.secondsRemaining % 10 == 0) {
        this.actualsentenceIndex = this.actualsentenceIndex + 1;
        this.actualsentence = this.sentence[(this.actualsentenceIndex)%3];
      }
      if (this.timer.secondsRemaining > 0) {
        this.timerTick();
      }
      else {
        this.timer.hasFinished = true;
        this.noGuideFind();
      }
    }, 1000);
  }

  static getSecondsAsDigitalClock(inputSeconds: number) {
    let sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    let minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    let secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return minutesString + ':' + secondsString;
  }

  private noGuideFind() {
    document.getElementById("container").classList.add('timeout');
    document.getElementById("staticSentenceHtml").innerHTML = ("Purtroppo al momento nessuna <br> guida e\' disponibile.<br><br> ti consigliamo di contattare<br>l'ufficio IAT di zona.");
    this.staticSentence = "Purtroppo al momento nessuna guida e\' disponibile ti consigliamo di contattare l'ufficio IAT di zona";
    document.getElementById("timer").classList.add('telephoneNumber');
    this.timer.displayTime = "+39 3494427744";


  }


  restCall(number, id){
    let token = window.localStorage.getItem("token");
    if(token==null){
      setTimeout(this.restCall(number, id),2000);
    }else {
      let link = 'http://' + this.ipv4 + ':31206/api/lookingForAGuide';
      let headers = new Headers({
        'Content-Type': 'application/json'
      });
      let options = new RequestOptions({
        headers: headers
      });
      let data = JSON.stringify({number: number, token: token, place_id: id});
      this.http.post(link, data, options)
        .subscribe(data => {
        }, error => {
          alert("time out from server!" + error.code);
          console.log(error);
        });
    }
}



}

export class ITimer {
  seconds: number;
  secondsRemaining: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: string;
}
