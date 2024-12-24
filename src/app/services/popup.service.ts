import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

  makePopup(data: {lat:number,lang:number,date?:number}): string { 
    return `` +
      (data.date?
      `<div>Date: ${new Date(data.date).toLocaleString("az-AZ")}</div>`:"")+
      `<div>Latitude: ${ data.lat }</div>` +
      `<div>Longitude: ${ data.lang }</div>`
  }
}
