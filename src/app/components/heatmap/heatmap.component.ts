import { Component, OnInit, Input } from '@angular/core';
import { MouseEvent } from '@agm/core/services/google-maps-types';
import { AppComponent } from '../../app.component'; //evtl noch durch eigene api Klasse auszutauschen
import { } from '@types/googlemaps';
import { HeatmapComponentColor } from './heatmap.component.color';
import { All } from '../../models/all.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  @Input() date: string;
  @Input() hour: string;

  latitude = 52.26594;
  longitude = 10.52673;
  zoom: number = 11;

  map: google.maps.Map;
  numberOfNodes: number;
  marker: google.maps.Marker[] = new Array();
  infowindow: google.maps.InfoWindow[] = new Array();

  layer: number = 0; //0=default, 1=Luftfeuchtigkeit, 2=Luftdruck, 3=Temperatur, 4=Partikel25, 5=Partikel100

  alert: string;
  printDatetime: any = ["aktuelle Messwerte"];

  nodeData;
  airValueData;

  //über api. kann auf Objekte mit den Messwerten zugegriffen werden
  constructor(private api: ApiService) {
  }

  async ngOnInit() {

    //map initialisieren:
    var mapProp = {
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: this.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById("map"), mapProp);

    this.nodeData = await this.api.getNodes();
    this.airValueData = await this.api.getValues();

    this.setMarker();

  }

  setMarker(){
    //anzahl der Knoten bestimmen:
    this.numberOfNodes = this.nodeData.length;
    //Marker setzen:
    for(var i = 0; i < this.numberOfNodes; i++) {
      let location = new google.maps.LatLng(this.nodeData[i].latitude, this.nodeData[i].longitude);
      var node_id: string = this.nodeData[i].node_id;
      this.marker.push(new google.maps.Marker({
        position: location,
        map: this.map,
        title: "Messstation " + node_id
      }));
    }
    //Info Windows setzen:
    for(var i = 0; i < this.numberOfNodes; i++) {
      this.setInfoWindow(i);
    }
    //Info Windows Text setzen:
    for(var i = 0; i < this.numberOfNodes; i++) {
      this.setInfoWindowContent(i);
    }
  }

  //setzt Info Window für Knoten Nr. i
  setInfoWindow(i: number) {
    this.infowindow.push(new google.maps.InfoWindow());
    var marker = this.marker[i];
    var infowindow = this.infowindow[i];
    var self  = this;
    marker.addListener('click', function() {
      this.map.setZoom(14);
      this.map.setCenter(marker.getPosition());
      infowindow.open(this.map, marker);
      for(var j=0;j< self.infowindow.length;j++ ){
        if(j !== i){
          self.infowindow[j].close();
        }
      }

      var text:any =infowindow.getContent();
      self.printDatetime = text.split('<br>');
    });
  }

  //setzt Info Window Text für Knoten Nr. i
  //für luftdruck noch ändern, falsche einheit!!!!!!!!!!
  setInfoWindowContent(i: number) {
    var content: string;
    if (this.date == null) { // aktuelle Messwerte (date ist nicht gesetzt)
      var node_id: string = this.nodeData[i].node_id;
      var air_humidity: string = this.nodeData[i].air_humidity;
      var air_pressure: string = this.nodeData[i].air_pressure;
      var air_temperature: string = this.nodeData[i].air_temperature;
      var particle_25: string = this.nodeData[i].particle_25;
      var particle_100: string = this.nodeData[i].particle_100;
      var datetime: string = this.nodeData[i].datetime;
      content = "Messstation " + node_id + "<br><br>Messzeitpunkt: " + datetime + "<br><br>";
    } else { // ältere Messwerte (date ist gesetzt)
      var index = this.airValueData[i].air_value.findIndex(i => (i.date == this.date) && (i.hour == this.hour));
      var node_id: string = this.airValueData[i].node_id;
      var air_humidity: string = this.airValueData[i].air_value[index].air_humidity;
      var air_pressure: string = this.airValueData[i].air_value[index].air_pressure;
      var air_temperature: string = this.airValueData[i].air_value[index].air_temperature;
      var particle_25: string = this.airValueData[i].air_value[index].particle_25;
      var particle_100: string = this.airValueData[i].air_value[index].particle_100;
      content = "Messstation " + node_id + "<br><br>Messzeitpunkt: " + this.date + " um " + this.hour + " Uhr<br><br>";
    }
    //je nach Layer werden nur bestimmte Messwerte gelistet:
    switch(this.layer) {
      case 0: { //Standartansicht, alle Messwerte
        content = content + "Luftfeuchtigkeit: " + air_humidity + " %<br>Luftdruck: " +
          air_pressure + " Pa<br>Lufttemperatur: " + air_temperature + " °C<br>PM2.5: " +
          particle_25 + " µg/m³<br>PM10: " + particle_100 + " µg/m³<br>";
        break;
      }
      case 1: { //Luftfeuchtigkeit
        content = content + "Luftfeuchtigkeit: " + air_humidity + " %";
        break;
      }
      case 2: { //Luftdruck
        content = content + "Luftdruck: " + air_pressure + " Pa";
        break;
      }
      case 3: {  //Lufttemperatur
        content = content + "Lufttemperatur: " + air_temperature + " °C";
        break;
      }
      case 4: { //Partikel 25
        content = content + "PM2.5: " + particle_25 + " µg/m³";
        break;
      }
      case 5: { //Partikel 100
        content = content + "PM10: " + particle_100 + " µg/m³";
        break;
      }
    }
    this.infowindow[i].setContent(content);
  }

  //titel von marker (hover) ändern
  setMarkerTitle(i: number) {
    var newTitle: string;
    if (this.date == null) { // aktuelle Messwerte (date ist nicht gesetzt)
      var node_id: string = this.nodeData[i].node_id;
      var air_humidity: string = this.nodeData[i].air_humidity;
      var air_pressure: string = this.nodeData[i].air_pressure;
      var air_temperature: string = this.nodeData[i].air_temperature;
      var particle_25: string = this.nodeData[i].particle_25;
      var particle_100: string = this.nodeData[i].particle_100;
    } else { // ältere Messwerte (date ist gesetzt)
      var index = this.airValueData[i].air_value.findIndex(i => (i.date == this.date) && (i.hour == this.hour));
      var node_id: string = this.airValueData[i].node_id;
      var air_humidity: string = this.airValueData[i].air_value[index].air_humidity;
      var air_pressure: string = this.airValueData[i].air_value[index].air_pressure;
      var air_temperature: string = this.airValueData[i].air_value[index].air_temperature;
      var particle_25: string = this.airValueData[i].air_value[index].particle_25;
      var particle_100: string = this.airValueData[i].air_value[index].particle_100;
    }
    //je nach Layer werden nur bestimmte Messwerte gelistet:
    switch(this.layer) {
      case 0: { //Standartansicht, alle Messwerte
        newTitle = "Messstation " + node_id;
        break;
      }
      case 1: { //Luftfeuchtigkeit
        newTitle = "Luftfeuchtigkeit: " + air_humidity + " %";
        break;
      }
      case 2: { //Luftdruck
        newTitle = "Luftdruck: " + air_pressure + " Pa";
        break;
      }
      case 3: {  //Lufttemperatur
        newTitle = "Lufttemperatur: " + air_temperature + " °C";
        break;
      }
      case 4: { //Partikel 25
        newTitle = "PM2.5: " + particle_25 + " µg/m³";
        break;
      }
      case 5: { //Partikel 100
        newTitle = "PM10: " + particle_100 + " µg/m³";
        break;
      }
    }
    this.marker[i].setTitle(newTitle);
  }

  //setzt Tag und Stunde und ruft setLayer() auf, damit MarkerIcons neu geladen werden
  setTime() {
    if (this.date === undefined || this.date === null || this.date === "" || this.hour === undefined) { //date oder hour ist nicht gesetzt
      this.alert = "bitte Tag und Uhrzeit auswaehlen";
    } else {
      this.alert = "";
      this.setLayer(this.layer); //MarkerIcons werden neu geladen
    }
  }

  //setzt Tag auf null und ruft setLayer() auf, damit MarkerIcons neu geladen werden
  resetTime() {
    this.alert = "";
    this.date = null;
    this.setLayer(this.layer);
  }

  //hier wird der Layer gesetzt um das MarkerIcon symbol für die jeweiligen layer zu ändern
  //scale und fillcolor werden dann je nach ausgewähltem layer/messwert und messwert des knotens gesetzt
  setLayer(layer: number) {
    this.layer = layer;
    var count = 0; //zaehlt marker/stationen ohne vorhandenen messwert
    for(var i = 0; i < this.numberOfNodes; i++) {
      // wenn Datum gesetzt ist, aber keine Messwerte zu dem Zeitpunkt vorhanden sind:
      if ((this.date != null) && (this.airValueData[i].air_value.findIndex(i => (i.date == this.date) && (i.hour == this.hour)) < 0)) {
        this.marker[i].setMap(null); //marker unsichtbar machen
        count = count + 1;
      } else {
        //Messwerte sind vorhanden:
        this.marker[i].setMap(this.map); //marker sichtbar machen
        this.setInfoWindowContent(i); //InfoWindow Text setzen
        this.setMarkerTitle(i); //hover
        if (layer == 0) {
          // Standartansicht, also keine Layer Darstellung:
          this.marker[i].setIcon(null); //icon wird gelöscht -> Standart Marker Symbol
        } else {
          // Layeransicht, also MarkerIcons setzen:
          var perc = this.airValueToPerc(i);
          var radius = this.airValueToRadius(i, perc);
          this.marker[i].setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15 + radius,
            fillColor: this.percToColor(perc),
            fillOpacity: 0.9,
            strokeWeight: 0
          });
        }
      }
    }
    if (count == this.numberOfNodes) {
      this.alert = "keine Messwerte zu gewaehltem Zeitpunkt vorhanden";
      this.printDatetime[0] = "";
    } else {
      if (this.date ==  null) {
        this.printDatetime[0] = "aktuelle Messwerte";
      } else {
        this.printDatetime[0] = "Messwerte am " + this.date + " um " + this.hour + " Uhr";
      }
    }
  }

  //gibt für den jeweiligen Luftwert (->Layer) und Zeitpunkt (->date und time) der Messstation i
  //eine Zahl zwischen 0 und 100 aus
  airValueToPerc(i: number) {
    var r: number;
    if (this.date == null) {
      var air_humidity = this.nodeData[i].air_humidity;
      var air_pressure = this.nodeData[i].air_pressure;
      var air_temperature = this.nodeData[i].air_temperature;
      var particle_25 = this.nodeData[i].particle_25;
      var particle_100 = this.nodeData[i].particle_100;
    } else {
      var index = this.airValueData[i].air_value.findIndex(i => (i.date == this.date) && (i.hour == this.hour));
      var air_humidity = this.airValueData[i].air_value[index].air_humidity;
      var air_pressure = this.airValueData[i].air_value[index].air_pressure;
      var air_temperature = this.airValueData[i].air_value[index].air_temperature;
      var particle_25 = this.airValueData[i].air_value[index].particle_25;
      var particle_100 = this.airValueData[i].air_value[index].particle_100;
    }
    switch(this.layer) {
      case 1: { //Luftfeuchtigkeit zwischen 0 und 100
        r = air_humidity;
        break;
      }
      case 2: { //Luftdruck <950 - >1050
        r = (air_pressure * 0.01) - 950;
        break;
      }
      case 3: {  //Temperatur zwischen <-20 und >40
        r = (air_temperature + 20) * (10/6);
        break;
      }
      case 4: { //Partikel 25 zwischen 0 und >80
        r = particle_25 * (10/8);
        break;
      }
      case 5: { //Partikel 100 zwischen 0 und >100
        r = particle_100;
        break;
      }
    }
    if (r < 0) {r = 0;}
    if (r > 100) {r = 100;}
    return r;
  }

  //gibt für den jeweiligen Luftwert (->Layer und perc) Zahl zur Vergroesserung des Radius der Icons aus
  airValueToRadius(i: number, perc: number) {
    var radius: number;
    switch(this.layer) {
      case 1:   //Luftfeuchtigkeit
      case 2: { //Luftdruck
        radius = perc * 0.05;
        break;
      }
      case 3: { //Temperatur
        radius = 5;
        break;
      }
      case 4:   //Partikel 25
      case 5: { //Partikel 100
        radius = perc * 0.13;
        break;
      }
    }
    return radius;
  }

  //gibt basierend auf Prozentzahl Farbwert als string aus
  percToColor(perc: number) {
    var col = new HeatmapComponentColor();
    var hexColor: string;
    switch(this.layer) {
      case 1: { //Luftfeuchtigkeit
        hexColor = col.perc2color('c8daec', '326496', perc);
        break;
      }
      case 2: { //Luftdruck
        hexColor = col.perc2color('b5b5b5', '4b4b4b', perc);
        break;
      }
      case 3: { //Lufttemperatur
        //hexColor = col.perc2colorRG(perc);
        hexColor = col.perc2color('96dc49', 'eb1414', perc);
        break;
      }
      case 4: { //Partikel 25
        hexColor = col.perc2colorRG(perc);
        break;
      }
      case 5: { //Partikel 100
        hexColor = col.perc2colorRG(perc);
        break;
      }
    }
    return hexColor;
  }

}
