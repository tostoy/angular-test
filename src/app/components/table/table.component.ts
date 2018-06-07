import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { All } from '../../models/all.model';

import { ApiService } from '../../services/api.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {PageEvent} from '@angular/material';
import {MatSort, MatTableDataSource} from '@angular/material';




@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {

  // displayedColumns1 = ['position', 'name', 'weight', 'symbol'];
  // dataSource1 = new MatTableDataSource(ELEMENT_DATA);





  public dataSource =new MatTableDataSource();

  public date;
  public start_hour='00';
  public end_hour='00';
  public pageIndex=0;
  public length=0;
  @ViewChild(MatSort) sort: MatSort;
  alert: string;



  displayedColumns = ['air_humidity', 'air_pressure', 'air_temperature', 'date', 'node_id', 'particle_100', 'particle_25', 'long', 'lat']
  constructor(private api: ApiService) {
  }

  async ngOnInit() {
    //this.dataSource1.sort = this.sort;
    this.dataSource.sort = this.sort;
  }
  async download(){
    const ret = await this.api.download(this.date, this.start_hour, this.end_hour, this.pageIndex);
  }
  async setPage(e){
    console.log(e);
    this.pageIndex = e.pageIndex;
    const ret = await this.api.getAll(this.date, this.start_hour, this.end_hour, this.pageIndex);
    this.length = ret[0];
    this.dataSource =new MatTableDataSource( ret[1]);
    this.dataSource.sort = this.sort;
  }
 async  setTime() {
    if (this.date === undefined) { //date ist nicht gesetzt
      this.alert = "keinen Tag ausgewaehlt";
    } else {
      const ret = await this.api.getAll(this.date, this.start_hour, this.end_hour, this.pageIndex);
      this.length = ret[0];
      this.dataSource =new MatTableDataSource( ret[1]);
      this.dataSource.sort = this.sort;
    }
  }

}



// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }
//
// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];



