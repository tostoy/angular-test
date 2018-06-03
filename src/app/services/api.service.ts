import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { All } from '../models/all.model';

@Injectable()
export class ApiService {

  private url = "http://127.0.0.1:5002/";
  private param ;

  constructor(private httpClient: HttpClient) { }

  public async getNodes() : Promise<any> {
    return this.httpClient.get(this.url + 'nodes').toPromise();
  }

  public async getValues() : Promise<any> {
    return this.httpClient.get(this.url + 'airvalues').toPromise();
  }

  public getAll(date,start_hour, end_hour) : Promise<any> {
     this.param = date;
     console.log(this.param)
    return this.httpClient.get(this.url + 'allvalues/'+this.param,{
      params:{
        start_hour,
        end_hour
      }
    }).toPromise();
  }


}
