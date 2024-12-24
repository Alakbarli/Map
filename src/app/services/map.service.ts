import { Injectable } from '@angular/core';
import * as L from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  addCircleMarker(lat:any,lon:any,map:L.Map){
    const circle=L.circleMarker([lat,lon],{radius:7})
    circle.addTo(map)
  }
  addCircleMarkerWithPopup(lat:any,lon:any,map:L.Map,content:string){
    const circle=L.circleMarker([lat,lon],{radius:7});
    circle.bindPopup(content)
    circle.addTo(map)
  }
  addMarker(lat:any,lon:any,map:L.Map){
    const marker=L.marker([lat,lon])
    marker.addTo(map)
  }
  locate(map:L.Map){
    map?.locate({
      watch:true,
      setView: true,
      maxZoom: 10,
      timeout:100000,
      maximumAge: 0,
      enableHighAccuracy: true
    })
  }
}
