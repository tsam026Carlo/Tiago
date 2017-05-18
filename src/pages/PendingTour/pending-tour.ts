import {Component} from "@angular/core";
import {NavController, NavParams, Platform} from "ionic-angular";
import {NativeStorage} from "@ionic-native/native-storage";
import {Http} from "@angular/http";
/**
 * Generated class for the Timer page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-pending-tour',
  templateUrl: 'pending-tour.html',
})
export class PendingTour {


  public ipv4 = "139.162.184.140";

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public nativeStorage: NativeStorage, public http: Http) {

    this.platform.ready().then(() => {

    });
  }
}
