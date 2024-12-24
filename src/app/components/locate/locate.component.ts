import { JsonPipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as L from "leaflet";
import { MapService } from '../../services/map.service';
const iconRetinaUrl = 'public/marker-icon-2x.png';
const iconUrl = 'public/marker-icon.png';
const shadowUrl = 'public/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-locate',
  standalone: true,
  imports: [],
  templateUrl: './locate.component.html',
  styleUrl: './locate.component.scss'
})
export class LocateComponent implements OnInit,AfterViewInit,OnDestroy{
  private map?:L.Map;
  interval:any;
  constructor(private mapService:MapService){

  }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
  ngAfterViewInit(): void {
    this.initMap();
    this.watch()
    
  }
  ngOnInit(): void {
  }
  initMap(){
    this.map = L.map('map', {
      center: [ 40.40050871474247, 47.61794526591817 ],
      zoom: 6
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  location?:GeolocationPosition;
  getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
       this.location=pos;
       this.mapService.addCircleMarker(this.location?.coords.latitude,this.location?.coords.longitude,this.map!);
      })
     }
  }

  watch(){
    this.interval=setInterval(() => {
      this.getLocation();
    }, 1000);
  }
}
