import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http:HttpClient=inject(HttpClient);
  constructor() { }
  
  get(url:string):Observable<any>{
    return this.http.get(url);
  }
}
