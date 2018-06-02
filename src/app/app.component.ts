import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  nodeData; //alle Knoten mit letzten Messwerten und dazugehoerigen Messzeitpunkten
  airValueData; //alle Knoten mit Messwerten(Durchschnitt pro Stunde, 2 Stellen nach Komma) sortiert nach Tag und Stunde
  
  /*
  Bsp. 1: "aktuelle Temperatur von Messstation mit Id=5"
  var index = nodeData.findIndex(i => i.node_id === "5");
  result = nodeData[index].air_temperature;

  Bsp. 2: "Temperatur von Messstation mit Id=5 am 28.4.2018 um 15 Uhr"
  var index1 = airValueData.findIndex(i => i.node_id === "5");
  var index2 = airValueData[index1].air_value.findIndex(i => (i.date === "2018-04-28") && (i.hour === "15"));
  result = airValueData[index1].air_value[index2].air_temperature;


  evtl noch weiter Datenobjekte mit Höchst/Niderigst werten o.ä.??
  constructor ist dementsprechend zu ergänzen
  */


  constructor() {
    
      }
      
  }
  
  
