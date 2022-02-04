import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DemoServiceService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast?';
   
  constructor(private httpClient: HttpClient) { }
  
  getPosts(title:String){
    return this.httpClient.get(this.url + 'q='+title+'&appid=c6dbdddce83ff3a8dceaeff8791c9f69');
  }
}
