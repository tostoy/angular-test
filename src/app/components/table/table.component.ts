import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { All } from '../../models/all.model'; 

import { ApiService } from '../../services/api.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {PageEvent} from '@angular/material';
import {MatPaginator, MatTableDataSource} from '@angular/material';




@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
  
  public dataSource;
  public date;
  alert: string;

  

  displayedColumns = ['air_humidity', 'air_pressure', 'air_temperature', 'date', 'node_id', 'particle_100', 'particle_25', 'long', 'lat']
  constructor(private api: ApiService) { 
  }

  async ngOnInit() {
     
  }

 async  setTime() {
    if (this.date === undefined) { //date ist nicht gesetzt
      this.alert = "keinen Tag ausgewaehlt";
    } else {
      this.dataSource = await this.api.getAll(this.date); 
      
    }
  }
   
}

 


  


