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
  public async download(date,start_hour, end_hour,page_index): Promise<any> {
    this.param = date;
    console.log(this.param)
    const data= await this.httpClient.get(this.url + 'download/'+this.param,{
    params: {
      start_hour,
      end_hour,
      page_index

    },
    responseType:'text'
     }).toPromise();
    let a = document.createElement('a');
    //let url = window.URL.createObjectURL(data);
    let blob = new Blob([data], { type:'text/csv'});
    let windowUrl = (window.URL || window.webkitURL);
    let url = windowUrl.createObjectURL(blob);
    a.href = url;
    a.download = 'data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  public getAll(date,start_hour, end_hour,page_index) : Promise<any> {
     this.param = date;
     console.log(this.param)
    return this.httpClient.get(this.url + 'allvalues/'+this.param,{
      params:{
        start_hour,
        end_hour,
        page_index
      }
    }).toPromise();
  }


}
