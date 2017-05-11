import {Component, ViewChild} from '@angular/core';
import {NavController, LoadingController, MenuController, Platform} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import {DetailPage} from "../detail/detail";
import {Http, RequestOptions, Headers} from '@angular/http';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {NativeStorage} from "@ionic-native/native-storage";
import {LoginPage} from "../login/login";
import {GuideAreaPage} from "../guide-area/guide-area";

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Geolocation]
})



export class HomePage {


  @ViewChild('map') mapElement;
  map: any;
  labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  marker: any;
  areaCircle: any;
  follow = true;
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  loader: any;
  ipv4 = "139.162.184.140";
  mPlaces: any;
  latLng: any;
  refresher: any;
  public mPlacesToDisplay: any;
  public mMarkerDisplayed: any;
  private lanlng: any;
  private isLoading: boolean;

  ionViewDidLoad() {
    this.initMap();
  }

  //QR-scan
  click() {
    this.barcode.scan()
      .then((result) => {
        if (!result.cancelled) {
          this.presentModal(result.text, "");
        }
      })
      .catch((err) => {
        alert(err);
      })
  }
  //QR-scan

  //recentrate
  centerMap(){
    if(this.follow==true)
        this.follow = false;
    else
        this.follow = true;
    alert("you changed mode");
  }
  apriAreaGuida(){
    this.navCtrl.push(GuideAreaPage);
  }
  //recentrate



  constructor(public navCtrl: NavController,
              public platform: Platform,
              public barcode: BarcodeScanner,
              public geolocation: Geolocation,
              public modalCtrl: ModalController,
              public http: Http,
              public loadingCtrl: LoadingController,
              public menuCtrl: MenuController,
              public nativeStorage: NativeStorage) {

    this.setupLoader();
    this.presentLoader();
    this.platform.ready().then(() => {
      if(window.localStorage.getItem("guide")=="false"){
        document.getElementById("guida").style.visibility="hidden";
      }
      menuCtrl.enable(true);
      this.mPlacesToDisplay = [];
      this.mMarkerDisplayed = [];
    });
  }

  public presentModal(id, name) {
    let modal = this.modalCtrl.create(DetailPage, {"id": id, "name": name});
    modal.present();
  }


  presentLoader(){
    this.isLoading= true;
    this.loader.present();
  }


  getPlaces() {
    this.mPlaces = [];
    var link = 'http://'+this.ipv4+':31206/api/getPlaces';
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    this.http.get(link, options)
      .subscribe(data => {
        for (var i = 0; i < data.json().data.length; i++) {
          this.mPlaces.push(new Places(data.json().data[i].name, 'http://' + this.ipv4 + ':80/tiago/photo/' + data.json().data[i].photo, data.json().data[i].id, data.json().data[i].lat, data.json().data[i].lon));
        }
      }, error => {
        alert("An error occurred, please check your gps and internet, then refresh the map from the menu bellow");
        if (this.refresher != null) this.refresher.complete();
        else this.loader.dismiss();
      });

  }


  setupLoader() {
    this.loader = this.loadingCtrl.create({
      content: "loading"
    });
  }

  initMap() {
    var mapOptions;
    let lanlng = new google.maps.LatLng(0, 0);
    mapOptions = {
      center: lanlng,
      zoom: 8,
      disableDefaultUI: true,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#cacaca"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#a1a1a1"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#cacaca"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#cacaca"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#181818"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1b1b1b"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#2c2c2c"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#cacaca"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#373737"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3c3c3c"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#4e4e4e"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3d3d3d"
            }
          ]
        }
      ]
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.finalizeMapInit();
  }

  options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 0
  };



  finalizeMapInit() {
    if(this.mPlaces==null){
      this.getPlaces();
    }
    if(!this.isLoading){
      this.setupLoader();
      this.presentLoader();
    }
    var options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0
    };

    if(this.watch!=null){
      navigator.geolocation.clearWatch(this.watch);
    }
      this.watch = navigator.geolocation.watchPosition((position: Geoposition) => {

        console.log(position);

        if(position.coords==null){
          alert("An error occurred, please check that gps in enabled, then refresh the map from the menu bellow");
          this.loader.dismiss();
          this.isLoading = false;
        }
        else if (this.lat != position.coords.latitude && this.lng != position.coords.longitude) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.lanlng = new google.maps.LatLng(this.lat, this.lng);
          this.watchGeolocation(this.lanlng);
          this.checkPlacesToDisplay();
        }
        else{
          this.loader.dismiss();
          this.isLoading = false;
        }

      }, error => {
        alert("An error occurred, please check that gps in enabled, then refresh the map from the menu bellow");
        this.loader.dismiss();
        this.isLoading = false;
      },options);
    // .subscribe((position: Geoposition) => {
    //
    //     console.log(position);
    //
    //     if(position.coords==null){
    //       alert("An error occurred, please check that gps in enabled, then refresh the map from the menu bellow");
    //       this.loader.dismiss();
    //       this.isLoading = false;
    //     }
    //     else if (this.lat != position.coords.latitude && this.lng != position.coords.longitude) {
    //       this.lat = position.coords.latitude;
    //       this.lng = position.coords.longitude;
    //       this.lanlng = new google.maps.LatLng(this.lat, this.lng);
    //       this.watchGeolocation(this.lanlng);
    //       this.checkPlacesToDisplay();
    //     }
    //     else{
    //       this.loader.dismiss();
    //       this.isLoading = false;
    //     }
    //
    //   }, error => {
    //     alert("An error occurred, please check that gps in enabled, then refresh the map from the menu bellow");
    //     this.loader.dismiss();
    //     this.isLoading = false;
    //   });

  }
  setMarkers(lanlng) {

    if(this.follow){
      this.map.setZoom(17);
      this.map.setCenter(lanlng);
    }


    this.areaCircle = new google.maps.Circle({
      strokeColor: '#bfbfbf',
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: '#bfbfbf',
      fillOpacity: 0.15,
      map: this.map,
      center: lanlng,
      radius: 1000
    });
    var image = {
      url: './images/markermio.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(36, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(36 / 2, 32 / 2)
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
      coords: [1, 1, 36, 1, 36, 32, 1, 32],
      type: 'poly'
    };
    this.marker = new google.maps.Marker({
      position: lanlng,
      map: this.map,
      title: 'you are here',
      icon: image,
      shape: shape
    });
    this.marker.addListener('click', function () {
      this.map.setZoom(17);
      this.map.setCenter(lanlng);
    });

  }


  setPlaceMarker(){
    if(this.isLoading){
      this.loader.dismiss();
      this.isLoading = false;
    }
    console.log(this.mPlacesToDisplay);
    console.log(this.mPlaces);
    var image = {
      url: './images/marker_place.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(32, 38),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(32 / 2, 38)
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
      coords: [1, 1, 32, 1, 32, 38, 1, 38],
      type: 'poly'
    };


    var i: number;
    var tmp;

    if(this.mMarkerDisplayed.length>=1){
      for (var i = 0; i < this.mMarkerDisplayed.length; i++) {
        if(this.mMarkerDisplayed[i]!=null){
          this.mMarkerDisplayed[i].setMap(null);
          this.mMarkerDisplayed[i]=null;
        }
      }
    }
    for (var i = 0; i < this.mPlacesToDisplay.length; i++) {
      tmp = this.mPlacesToDisplay[i];
      this.mMarkerDisplayed[i] = new google.maps.Marker({
        position: new google.maps.LatLng(this.mPlacesToDisplay[i].lat, this.mPlacesToDisplay[i].lng),
        map: this.map,
        icon: image,
        shape: shape,
        label: this.labels[i % this.labels.length],

      });

      google.maps.event.addListener(this.mMarkerDisplayed[i], 'click', (function(modalCtrl, tmp) {
        return function() {
          let modal = modalCtrl.create(DetailPage, {"id": tmp.id, "name": tmp.name});
          modal.present();
        }
      })(this.modalCtrl, tmp));
    }
  }


  watchGeolocation(lanlng) {
    if (this.marker == null) {
      this.setMarkers(lanlng);
    } else {
      if(this.follow==true){
        this.map.setCenter(lanlng);
        this.map.setZoom(17);
      }

      this.marker.setPosition(lanlng);
      this.areaCircle.setCenter(lanlng);
      this.marker.addListener('click', function () {
        this.map.setZoom(17);
        this.map.setCenter(lanlng);
      });

    }
  }

  public checkPlacesToDisplay() {
    console.log(this.mPlacesToDisplay);
    console.log(this.mMarkerDisplayed);
    window.setTimeout(() => {
      var vAddPlaceToDisplay = false;
      for (var i = 0; i < this.mPlaces.length; i++) {
        let distance = google.maps.geometry.spherical.computeDistanceBetween(this.lanlng, new google.maps.LatLng(this.mPlaces[i].lat, this.mPlaces[i].lng));
        let placesIndexInArray = this.mPlacesToDisplay.indexOf(this.mPlaces[i]);
        if (distance <= 1000) {
          if(!(placesIndexInArray>-1)){
            this.mPlacesToDisplay.push(this.mPlaces[i]);
            vAddPlaceToDisplay = true;
          }

        }
        else{
          if(placesIndexInArray>-1){
            vAddPlaceToDisplay = true;
            this.mPlacesToDisplay.splice(placesIndexInArray,1);
          }
        }

      }
    if(this.mPlacesToDisplay.length>0 && vAddPlaceToDisplay)
      this.setPlaceMarker();
    }, 3000);
  }



  logout(){
    var number = window.localStorage.getItem("number")
    let link = 'http://'+this.ipv4+':31206/api/unregister';
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    let data = JSON.stringify({phone: number});
    this.http.post(link, data, options)
      .subscribe(data => {
          console.log(data);
      }
    );
    localStorage.removeItem('number');
    localStorage.removeItem('guide');
    this.navCtrl.setRoot(LoginPage);
  }
}


export class Places {
  name: string;
  image: string;
  id: string;
  lat: any;
  lng: any;

  constructor(aName: string, aImage: string, aId: string, aLat: any, aLng: any) {
    this.name = aName;
    this.image = aImage;
    this.id = aId;
    this.lat = aLat;
    this.lng = aLng;
  }
}


export class LatLon {
  lat: number;
  lon: number;

  constructor(aLat: number, aLon: number) {
    this.lat = aLat;
    this.lon = aLon;
  }
}



